import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyCmUONPceaIvAx6QHwy2tw202Zx4ZbIvRM",
   authDomain: "proyecto-web-coctelis.firebaseapp.com",
   projectId: "proyecto-web-coctelis",
   storageBucket:"proyecto-web-coctelis.appspot.com",
   messagingSenderId: "901935873318",
   appId: "1:901935873318:web:efbbffcf7fedcb290095e7"
 };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export { db };
export const storage = getStorage(app);
export default app;
