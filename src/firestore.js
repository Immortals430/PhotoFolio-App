
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// firestore configs
const firebaseConfig = {
  apiKey: "AIzaSyBjrLbmQs9fniC4uXY_Y0ENRCghNazTf1I",
  authDomain: "my-project-88014-1691669634230.firebaseapp.com",
  projectId: "my-project-88014-1691669634230",
  storageBucket: "my-project-88014-1691669634230.appspot.com",
  messagingSenderId: "209966177511",
  appId: "1:209966177511:web:16d6905d659c59e6699642",
  measurementId: "G-7BCXE4R0CQ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
