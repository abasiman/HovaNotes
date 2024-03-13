
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBV_BzOkSdFvVYWZ0THA3VwgxmTSUH8uXQ",
  authDomain: "todoapp-a926b.firebaseapp.com",
  projectId: "todoapp-a926b",
  storageBucket: "todoapp-a926b.appspot.com",
  messagingSenderId: "428760748488",
  appId: "1:428760748488:web:c561f821834de7f3edf0fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)
export const authdatabase = getAuth(app)
export const imageDb = getStorage(app)

