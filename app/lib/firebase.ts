// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzFSRezSR2elSZWUlvTWdvfggATi1jGek",
  authDomain: "task-manager-68393.firebaseapp.com",
  projectId: "task-manager-68393",
  storageBucket: "task-manager-68393.firebasestorage.app",
  messagingSenderId: "1006165407757",
  appId: "1:1006165407757:web:87becb39194527e6ee3d44",
  measurementId: "G-SS5M29TE8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db = getFirestore(app);