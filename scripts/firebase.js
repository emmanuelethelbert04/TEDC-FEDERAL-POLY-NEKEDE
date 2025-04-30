import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import * as firebaseAuthJs from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";  
import { getDatabase} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";  
import {getStorage} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD76lHGZfHrzT2CF-fEuIMoGTwXD0j-yPU",
  authDomain: "edc-fedponek.firebaseapp.com",
  projectId: "edc-fedponek",
  storageBucket: "edc-fedponek.firebasestorage.app",
  messagingSenderId: "369636473155",
  appId: "1:369636473155:web:715e95139a0c2e9bb057f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = firebaseAuthJs.getAuth(app);  
const database = getDatabase(app); 
const storage = getStorage(app); 
export { auth, database, storage };