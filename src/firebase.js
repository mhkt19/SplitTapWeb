import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpPCAHjNM4eWOQ-ICotLyy_GFg5zvVP9c",
  authDomain: "splittap-95400.firebaseapp.com",
  databaseURL: "https://splittap-95400-default-rtdb.firebaseio.com",
  projectId: "splittap-95400",
  storageBucket: "splittap-95400.firebasestorage.app",
  messagingSenderId: "465302512803",
  appId: "1:465302512803:web:f4271452666b767685cb16",
  measurementId: "G-LGX42EHPEG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
