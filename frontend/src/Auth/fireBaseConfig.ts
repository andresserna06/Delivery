// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJc8bgUNytnI-WMfMrJAmR8uBJpkbkIzM",
  authDomain: "delivery-2b87e.firebaseapp.com",
  projectId: "delivery-2b87e",
  storageBucket: "delivery-2b87e.firebasestorage.app",
  messagingSenderId: "53085574344",
  appId: "1:53085574344:web:bc00185ddaf3cfa38881fd",
  measurementId: "G-E5HCZDK5S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

// Agregar scopes para Microsoft
microsoftProvider.addScope('user.read');
microsoftProvider.addScope('email');

export { app, auth, googleProvider, githubProvider, microsoftProvider, analytics };