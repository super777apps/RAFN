// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTHW7wIj19RZcCUMp27sViO07i32zLi3w",
  authDomain: "rafnaustralia-eee84.firebaseapp.com",
  projectId: "rafnaustralia-eee84",
  storageBucket: "rafnaustralia-eee84.appspot.com",
  messagingSenderId: "42403065720",
  appId: "1:42403065720:web:307018ce714ae2cecf628d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);