import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  GeoPoint,
  updateDoc,
  arrayUnion,
  arrayRemove,
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

export const toggleLikePost = async (postID, userID) => {
  const postRef = doc(db, "Post", postID);
  try {
    const postSnapshot = await getDoc(postRef);
    if (!postSnapshot.exists()) {
      console.log("Post does not exist!");
      return false; // Indicates no action was taken
    }

    const postData = postSnapshot.data();
    const likedBy = postData.LikedBy || [];

    if (likedBy.includes(userID)) {
      // User has already liked the post, so remove their like
      await updateDoc(postRef, {
        Likes: postData.Likes > 0 ? postData.Likes - 1 : 0,
        LikedBy: arrayRemove(userID),
      });
      return false; // Indicates like was removed
    } else {
      // User has not liked the post yet, so add their like
      await updateDoc(postRef, {
        Likes: postData.Likes + 1,
        LikedBy: arrayUnion(userID),
      });
      return true; // Indicates like was added
    }
  } catch (error) {
    console.error("Error toggling like on post:", error);
    return false; // Indicates no action was taken
  }
};

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
    // Adjust the mapping to include the post ID
    const postsWithId = friendPosts.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    allPosts = [...allPosts, ...postsWithId];
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
