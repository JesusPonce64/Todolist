import firebaseProyecto from "./firebaseconfig";
import { getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut } from "firebase/auth";

const auth= getAuth(firebaseProyecto)

export const signinUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        console.log(userCredential);
        
        // ...
      })
      .catch((error) => {
        console.log(error);
        
        // ..
      });
    
};

export const logoutFirebase = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("cerró sesion")
    }).catch((error) => {
    // An error happened.
    console.log(error)
    });
};

export const userListener = (listener) => {
  onAuthStateChanged(auth, (user) => {
    listener(user);
  });
}
