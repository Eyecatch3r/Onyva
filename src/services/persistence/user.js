import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function registerUser(userCredential, username) {
  const user = userCredential.user;
  await addDoc(collection(db, "User"), {
    username: username,
    useruid: user.uid,
    score: 0,
  });
  console.log("User created:", user);
}

export async function getUserByUID(UID) {
  const querySnapshot = await getDocs(collection(db, "User"));
  const user = querySnapshot.docs.find((doc) => doc.data().useruid === UID);
  return user ? user.data() : null;
}

export const validateUsername = async (username) => {
  let usernameTaken = false;

  const querySnapshot = await getDocs(collection(db, "Users"));
  querySnapshot.forEach((doc) => {
    doc.data().username === username
      ? (usernameTaken = true)
      : (usernameTaken = false);
  });
  return usernameTaken;
};

export const getPfpUrl = async (uid) => {
  let url = null;
  try {
    url = await getDownloadURL(ref(storage, "Images/Profile Pictures/" + uid));
  } catch (error) {
    console.log(error);
  }

  return url;
};

export const updatePfp = async (uid, pfp) => {
  const storageRef = ref(storage, `Images/Profile Pictures/${uid}`);

  try {
    uploadBytes(storageRef, pfp).then((snapshot) => {
      console.log("Uploaded Pfp");
    });
  } catch (error) {
    console.error("Error updating profile picture: ", error);
    return error.message;
  }
};
