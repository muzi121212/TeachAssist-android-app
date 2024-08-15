// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdn5QmIZiBZiV61MsRrfPT5mxv2hkOamI",
  authDomain: "teachassist-db788.firebaseapp.com",
  projectId: "teachassist-db788",
  storageBucket: "teachassist-db788.appspot.com",
  messagingSenderId: "672825155603",
  appId: "1:672825155603:web:11ba109250ad5e8b821fe6",
  measurementId: "G-TTW2YJYFNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage =getStorage(app);