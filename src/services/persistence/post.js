import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  GeoPoint,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFriendList, getPostsByUserID, getUserByUID } from "./user";

export async function createPost(
  userCredential,
  image,
  score,
  locationName,
  location,
) {
  const user = await getUserByUID(userCredential.uid);
  const userRef = doc(db, "User", user.id);
  const geoPoint = new GeoPoint(location.lat, location.lng);
  const docRef = await addDoc(collection(db, "Post"), {
    User: userRef,
    "Location Name": locationName,
    location: geoPoint,
    Score: score,
    Timestamp: Timestamp.now(),
    Likes: 0,
  });

  const newPostID = docRef.id;
  await updatePostImage(newPostID, image);
  console.log("Post created:", user.id);
}

export async function getPostByID(postID) {
  const documentReference = doc(db, "Post", postID);
  const documentSnapshot = await getDoc(documentReference);
  return documentSnapshot ? documentSnapshot.data() : null;
}

export const getPostUrl = async (postID) => {
  let url = null;
  try {
    url = await getDownloadURL(ref(storage, "Images/Posts/" + postID));
  } catch (error) {
    console.log(error);
  }

  return url;
};

export const getFriendsPosts = async (uid) => {
  const friends = await getFriendList(uid);
  let allPosts = [];

  for (let i = 0; i < friends.length; i++) {
    const friendPosts = await getPostsByUserID(friends[i].id);
    allPosts = [...allPosts, ...friendPosts.docs.map((doc) => doc.data())];
  }

  return allPosts;
};

export const updatePostImage = async (postID, image) => {
  const storageRef = ref(storage, `Images/Posts/${postID}`);

  try {
    uploadBytes(storageRef, image).then((snapshot) => {
      console.log("Uploaded Image");
    });
  } catch (error) {
    console.error("Error updating profile picture: ", error);
    return error.message;
  }
};
