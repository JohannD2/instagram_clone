// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8zDp-_RqL71hoKtV5p62GjM61No_vKBo",
  authDomain: "instaclone-52569.firebaseapp.com",
  projectId: "instaclone-52569",
  storageBucket: "instaclone-52569.appspot.com",
  messagingSenderId: "221321788909",
  appId: "1:221321788909:web:4d036a9b5df0038b3c3be4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); 

const db = getFirestore();
const storage = getStorage();

export { app, db, storage };