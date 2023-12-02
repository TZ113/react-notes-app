// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpUdw7ITNJfWAtHnfh7uXpQSToJy3-cXQ",
  authDomain: "react-notes-app-9a32b.firebaseapp.com",
  projectId: "react-notes-app-9a32b",
  storageBucket: "react-notes-app-9a32b.appspot.com",
  messagingSenderId: "868650149673",
  appId: "1:868650149673:web:319517c871c2b9d5ecf938",  //1:868650149673:web:319517c871c2b9d5ecf938
  measurementId: "G-CQGKYTGY9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");