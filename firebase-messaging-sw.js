importScripts("https://glipo.cf/lib/firebase-app.js");
importScripts("https://glipo.cf/lib/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyBxs_F52qiFI85ZbFQ7ysIrvBhKDEvutuw",
    authDomain: "glipo-net.firebaseapp.com",
    databaseURL: "https://glipo-net.firebaseio.com",
    projectId: "glipo-net",
    storageBucket: "glipo-net.appspot.com",
    messagingSenderId: "991734469429",
    appId: "1:991734469429:web:93a3a72653c3921831f27c",
    measurementId: "G-MGPY4PE9JH"
});

firebase.messaging();