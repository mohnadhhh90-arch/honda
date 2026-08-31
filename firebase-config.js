// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiW1FpCzeW4Zz4cUN9J6vRJuERMiYH8A8",
  authDomain: "honda-d02ef.firebaseapp.com",
  projectId: "honda-d02ef",
  storageBucket: "honda-d02ef.firebasestorage.app",
  messagingSenderId: "1027992512823",
  appId: "1:1027992512823:web:4167c3b0774f362c02d2b2",
  measurementId: "G-EGSLFKW0FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ربطها بـ window عشان تقدر تستخدمها في باقي ملفات المشروع زي app.js
window.db = db;
window.collection = collection;
window.getDocs = getDocs;
window.addDoc = addDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;
window.setDoc = setDoc;

console.log("Firebase Connected Successfully! 🚀");
