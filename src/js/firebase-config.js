// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQgYiQo-qzBkr7jFBUUORr01ImBX-SIk8",
  authDomain: "huellitasdelalma-60cfb.firebaseapp.com",
  databaseURL: "https://huellitasdelalma-60cfb-default-rtdb.firebaseio.com",
  projectId: "huellitasdelalma-60cfb",
  storageBucket: "huellitasdelalma-60cfb.firebasestorage.app",
  messagingSenderId: "1010111418840",
  appId: "1:1010111418840:web:33efac312ca4dd6de022ad",
  measurementId: "G-NV6YYVFJS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, child };
