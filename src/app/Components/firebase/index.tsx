import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHvULzh4K3w2IXxHy9ufZm1WZaCx2ebvU",
  authDomain: "techbox-d0b57.firebaseapp.com",
  projectId: "techbox-d0b57",
  storageBucket: "techbox-d0b57.appspot.com",
  messagingSenderId: "1075988310922",
  appId: "1:1075988310922:web:3dc2c6a83c6d2624f67673",
  measurementId: "G-63C6ZP3M8N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db , storage};