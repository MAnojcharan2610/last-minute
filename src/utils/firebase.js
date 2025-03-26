import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAJ465-ns4QcmXw4tyFgqWDkYJAxYp4MbM",
  authDomain: "spot-booking-92c82.firebaseapp.com",
  databaseURL: "https://spot-booking-92c82-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spot-booking-92c82",
  storageBucket: "spot-booking-92c82.firebasestorage.app",
  messagingSenderId: "128679616849",
  appId: "1:128679616849:web:9fe5875f5470ad935bb370"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const realtimeDb = getDatabase(app);
export const provider = new GoogleAuthProvider();

export const signInWithGooglePopup =async()=>{
  try{
       await signInWithPopup(auth,provider);
  }catch(e){
      console.error('error while signing in with google popup',e)
  }
}