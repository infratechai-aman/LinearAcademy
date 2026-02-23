import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC7BgTY374YGr6x5y78kxxD2lu-wAQe15M",
    authDomain: "linearacademy-b4f2b.firebaseapp.com",
    projectId: "linearacademy-b4f2b",
    storageBucket: "linearacademy-b4f2b.firebasestorage.app",
    messagingSenderId: "19773787527",
    appId: "1:19773787527:web:5b036b465e78f3b3efd722",
    measurementId: "G-70BR2YM58R"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics is only initialized if we are running in the browser
let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}
export { analytics };
