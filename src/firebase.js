import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBs6Qq_QEUh46M-0LSwcQDb91_VhcWdv0g',
    authDomain: 'onyvan.firebaseapp.com',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
