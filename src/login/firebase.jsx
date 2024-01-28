import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'tu-api-key',
  authDomain: 'tu-auth-domain',
  projectId: 'tu-project-id',
  storageBucket: 'tu-storage-bucket',
  messagingSenderId: 'tu-messaging-sender-id',
  appId: 'tu-app-id',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();

export { auth };
