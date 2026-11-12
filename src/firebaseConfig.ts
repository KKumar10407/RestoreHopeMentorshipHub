import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBVqVt5oRvSFResFxIF5eMVSmXJ4EfE1RY",
  authDomain: "restore-hope-mentorship-hub.firebaseapp.com",
  projectId: "restore-hope-mentorship-hub",
  storageBucket: "restore-hope-mentorship-hub.firebasestorage.app",
  messagingSenderId: "411620096348",
  appId: "1:411620096348:web:94e38dc83ce97fc6cc6999"
};

export const app = initializeApp(firebaseConfig);