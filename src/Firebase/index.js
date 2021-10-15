import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyATCcT5kRLeX2v6Woq3Hy51WuK1nCSMNnw",
    authDomain: "viblo-23154.firebaseapp.com",
    projectId: "viblo-23154",
    storageBucket: "viblo-23154.appspot.com",
    messagingSenderId: "1092369807883",
    appId: "1:1092369807883:web:982b9ab14ae9a3b2b1650e",
    measurementId: "G-YGEYV9VJ5W"
})
const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export default db;