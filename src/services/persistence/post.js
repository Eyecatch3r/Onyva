import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getUserByUID } from "./user";

export async function createPost(userCredential, image) {
  const user = userCredential.user;
  const docUser = await getUserByUID(user.uid);
  const docRef = await addDoc(collection(db, "Post"), {
    userID: `User/${docUser.id}`,
    score: 55,
  });
  const newPostID = docRef.id;
  await updatePostImage(newPostID, image);
  console.log("Post created:", user);
}

export async function getPostByID(postID) {
  const querySnapshot = await getDocs(collection(db, "Post"));
  const post = querySnapshot.docs.find((doc) => doc.data().useruid === postID);
  return post ? post.data() : null;
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
