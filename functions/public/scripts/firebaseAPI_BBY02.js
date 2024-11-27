//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyABRbMxdgLe4DsZx3-Zo-iqVnW3eUGPGIM",
    authDomain: "kidsconnect-6259e.firebaseapp.com",
    projectId: "kidsconnect-6259e",
    storageBucket: "kidsconnect-6259e.appspot.com",
    messagingSenderId: "313986570986",
    appId: "1:313986570986:web:0b2e75a32df3dc251b1593"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
//add today
const auth = firebase.auth();