import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBST9RkPUsuYx6NTfwIo381V-E9qooe-4k",
    authDomain: "lovesync-diary.firebaseapp.com",
    projectId: "lovesync-diary",
    storageBucket: "lovesync-diary.firebasestorage.app",
    messagingSenderId: "947569764358",
    appId: "1:947569764358:web:bb8e53af2194a8c2807b87",
    measurementId: "G-DDX8DXE1CK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
