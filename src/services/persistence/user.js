import { addDoc, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function registerUser(userCredential, username) {
  const user = userCredential.user;
  const docRef = await addDoc(collection(db, "User"), {
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
