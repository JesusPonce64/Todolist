// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS1MSxKT8Qnyh10DcGiLpXhG9zL3Oe1OI",
  authDomain: "to-do-list-81458.firebaseapp.com",
  databaseURL: "https://to-do-list-81458-default-rtdb.firebaseio.com",
  projectId: "to-do-list-81458",
  storageBucket: "to-do-list-81458.firebasestorage.app",
  messagingSenderId: "219815804819",
  appId: "1:219815804819:web:090572f419972fac593266"
};

// Initialize Firebase
const firebaseProyecto = initializeApp(firebaseConfig);
export default firebaseProyecto;


