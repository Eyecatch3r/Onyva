import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function registerUser(userCredential, username) {
  const user = userCredential.user;
  await addDoc(collection(db, "User"), {
    username: username,
    useruid: user.uid,
    score: 0,
    notifications: [],
  });
  console.log("User created:", user); // Log the user for debugging purposes
}

export async function getUserByUID(UID) {
  const querySnapshot = await getDocs(collection(db, "User"));
  const user = querySnapshot.docs.find((doc) => doc.data().useruid === UID);
  return user ? user : null;
}

export async function getUserByID(ID) {
  try {
    const documentReference = doc(db, "User", ID);
    const documentSnapshot = await getDoc(documentReference);

    if (documentSnapshot.exists()) {
      // Extract the user data from the document snapshot
      const userData = documentSnapshot.data();
      return userData;
    } else {
      // User document does not exist
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
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

export const getPfpUrlByUID = async (uid) => {
  let url = null;
  await getUserByUID(uid);
  try {
    url = await getDownloadURL(ref(storage, "Images/Profile Pictures/" + uid));
  } catch (error) {
    console.log(error);
  }

  return url;
};

export const getPfpUrlByID = async (id) => {
  let url = null;
  try {
    url = await getDownloadURL(ref(storage, "Images/Profile Pictures/" + id));
  } catch (error) {
    console.log(error);
  }

  return url;
};

export const updatePfp = async (id, pfp) => {
  const storageRef = ref(storage, `Images/Profile Pictures/${id}`);

  try {
    uploadBytes(storageRef, pfp).then((snapshot) => {
      console.log("Uploaded Pfp");
    });
  } catch (error) {
    console.error("Error updating profile picture: ", error);
    return error.message;
  }
};

export const getPostsByUID = async (uid) => {
  const user = await getUserByUID(uid);
  const userRef = doc(db, "User", user.id);
  const q = query(collection(db, "Post"), where("User", "==", userRef));
  return await getDocs(q);
};

export const getPostsByUserID = async (id) => {
  const documentReference = doc(db, "User", id);
  const q = query(
    collection(db, "Post"),
    where("User", "==", documentReference),
  );
  return await getDocs(q);
};

export const getFriendList = async (uid) => {
  const userDoc = await getUserByUID(uid);
  if (userDoc) {
    const userData = userDoc.data();
    const friendsRefs = userData.friends || [];
    const friends = [];

    for (let i = 0; i < friendsRefs.length; i++) {
      const friendId = String(friendsRefs[i].id); // Ensure that friendId is a string
      const friendDoc = doc(db, "User", friendId);
      const friendSnapshot = await getDoc(friendDoc);
      if (friendSnapshot.exists()) {
        friends.push(friendSnapshot);
      }
    }

    return friends;
  } else {
    console.log(`No user found with uid: ${uid}`);
    return null;
  }
};

export async function getNotificationsByUID(uid) {
  const querySnapshot = await getDocs(collection(db, "User"));
  const user = querySnapshot.docs.find((doc) => doc.data().useruid === uid);
  return user ? user.data().notifications : [];
}

export async function deleteNotificationByIndex(id, index) {
  const userDoc = doc(db, "User", id);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const notifications = userData.notifications;

    // Remove the notification at the given index
    notifications.splice(index, 1);

    // Update the notifications field in the user document
    await updateDoc(userDoc, { notifications: notifications });
  } else {
    console.log(`No user found with uid: ${id}`);
  }
}

export async function addNotificationByID(id, notification) {
  const userDocRef = doc(db, "User", id);

  try {
    // Fetch the current user document to ensure it exists
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      console.log(`No user found with UID: ${id}`);
      return;
    }

    // Update the document with the new notification using arrayUnion to ensure uniqueness
    await updateDoc(userDocRef, {
      notifications: arrayUnion(notification),
    });

    console.log(`Notification added for user ${id}`);
  } catch (error) {
    console.error("Error adding notification:", error);
  }
}

export async function increaseScore(UID, incrementAmount) {
  try {
    // Use the getUserByUID function to get the user document snapshot
    const userDocSnapshot = await getUserByUID(UID);

    if (userDocSnapshot && userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const currentScore = userData.score || 0; // Default to 0 if score is not set

      // Use the ref property of the document snapshot for updating
      await updateDoc(userDocSnapshot.ref, {
        score: currentScore + incrementAmount,
      });

      console.log(`Score of user ${UID} increased by ${incrementAmount}.`);
    } else {
      console.log(`No user found with UID: ${UID}`);
    }
  } catch (error) {
    console.error("Error increasing score:", error);
  }
}

export async function addFriend(CurrentUserUID, friendId) {
  const userCollectionRef = collection(db, "User");
  const q = query(userCollectionRef, where("useruid", "==", CurrentUserUID));
  const querySnapshot = await getDocs(q);
  const currentUserDoc = querySnapshot.docs[0];

  const friendUserDoc = doc(db, "User", friendId);

  if (currentUserDoc) {
    const currentUserData = currentUserDoc.data();
    const friends = currentUserData.friends || [];

    if (!friends.includes(friendUserDoc)) {
      friends.push(friendUserDoc);

      await updateDoc(currentUserDoc.ref, { friends: friends });
    } else {
      console.log(`User with id: ${friendId} is already a friend.`);
    }
  } else {
    console.log(`No user found with uid: ${CurrentUserUID}`);
  }
}

export async function removeFriend(CurrentUserUID, friendId) {
  const userCollectionRef = collection(db, "User");
  const q = query(userCollectionRef, where("useruid", "==", CurrentUserUID));
  const querySnapshot = await getDocs(q);
  const currentUserDoc = querySnapshot.docs[0];

  if (currentUserDoc) {
    const currentUserData = currentUserDoc.data();
    const friends = currentUserData.friends || [];
    console.log(friends);
    const friendIndex = friends.findIndex(
      (friendRef) => friendRef.id === friendId,
    );
    if (friendIndex !== -1) {
      friends.splice(friendIndex, 1);
      await updateDoc(currentUserDoc.ref, { friends: friends });
    } else {
      console.log(`User with id: ${friendId} is not a friend.`);
    }
  } else {
    console.log(`No user found with uid: ${CurrentUserUID}`);
  }
}

export async function getUsers(searchTerm) {
  // Get a reference to the 'User' collection
  const userCollectionRef = collection(db, "User");

  // Create a query that retrieves users whose username matches the search term
  const q = query(userCollectionRef, where("username", "==", searchTerm));

  // Execute the query and get a snapshot of the matching documents
  const querySnapshot = await getDocs(q);

  // Map the documents in the snapshot to their data and return the resulting array
  return querySnapshot.docs.map((doc) => doc);
}
