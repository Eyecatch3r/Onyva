import {getAuth} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyBs6Qq_QEUh46M-0LSwcQDb91_VhcWdv0g",
    authDomain: "onyvan.firebaseapp.com",
    projectId: "onyvan",
    storageBucket: "onyvan.appspot.com",
    messagingSenderId: "630667295625",
    appId: "1:630667295625:web:0b027cea0ee6020a1cff58",
    measurementId: "G-6HKLK71BYS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const analytics = getAnalytics(app);
export const db = getFirestore(app);