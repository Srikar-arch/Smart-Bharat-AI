import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const isFirebaseConfigured = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

if (isFirebaseConfigured && admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (err) {
    console.error("❌ Firebase Admin SDK initialization failed: ", err.message);
  }
}

export default admin;
export const isFirebaseEnabled = isFirebaseConfigured;
