import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { Capacitor } from "@capacitor/core";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(/*settings*/ {}),
});

function whichAuth() {
  let auth;
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    auth = getAuth();
  }
  return auth;
}

export const auth = whichAuth();

export const sendVerificationEmail = (user) => {
  return sendEmailVerification(user);
};

export const resetPasswordEmail = (auth, email) => {
  return sendPasswordResetEmail(auth, email);
};

export const createUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
export const signOutAccount = () => {
  return signOut(auth);
};

export const fetchScore = async (rating, reviewCount, distance) => {
  try {
    const response = await fetch(
      `https://getscore-xvp4yj3ueq-uc.a.run.app?rating=${rating}&reviewCount=${reviewCount}&distance=${distance}`,
    );
    const data = await response.json();
    const score = Math.round(data.score);
    console.log("Score", score);
    return score;
  } catch (error) {
    console.error("Error fetching score", error);
    return 0;
  }
};

export const storage = getStorage(app);

const analytics = getAnalytics(app);

if (window.location.hostname === "localhost") {
  //connectFirestoreEmulator(db, "localhost", 8080);
}
