// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyB7pDfTqXswD7HFyXVqdyHQWIIXKPlJK0I",
  authDomain: "dashboard-hub-c3565.firebaseapp.com",
  projectId: "dashboard-hub-c3565",
  storageBucket: "dashboard-hub-c3565.firebasestorage.app",
  messagingSenderId: "273278768717",
  appId: "1:273278768717:web:4a72bee01ec6728dd2ee04",
  measurementId: "G-34615SLZ2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);