/**
 * Check Firebase Authentication Status
 * Run this script to verify if Email/Password authentication is enabled
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2wG7O9LuceFRBbvr9mFVKu62OYFclxEE",
  authDomain: "coliv-management-help-desk.firebaseapp.com",
  projectId: "coliv-management-help-desk",
  storageBucket: "coliv-management-help-desk.firebasestorage.app",
  messagingSenderId: "1022591558108",
  appId: "1:1022591558108:android:30ca8e172043b2b49daf19",
};

console.log('\n🔍 Checking Firebase Authentication Status...\n');

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase initialized successfully');
  console.log('📋 Project ID:', firebaseConfig.projectId);
  console.log('🔑 API Key:', firebaseConfig.apiKey.substring(0, 20) + '...');
  
  // Try to create a test user (this will fail if auth is not enabled)
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  console.log('\n🧪 Testing Email/Password authentication...');
  console.log('   Creating test user:', testEmail);
  
  createUserWithEmailAndPassword(auth, testEmail, testPassword)
    .then((userCredential) => {
      console.log('\n✅ SUCCESS! Email/Password authentication is ENABLED');
      console.log('✅ Test user created:', userCredential.user.uid);
      console.log('\n🎉 Your Firebase authentication is working correctly!');
      console.log('🔐 You can now use login and signup in your app.\n');
      process.exit(0);
    })
    .catch((error) => {
      console.log('\n❌ ERROR:', error.code);
      console.log('   Message:', error.message);
      
      if (error.code === 'auth/operation-not-allowed') {
        console.log('\n🚨 Email/Password authentication is NOT ENABLED');
        console.log('📝 Follow these steps:');
        console.log('   1. Open: https://console.firebase.google.com/project/coliv-management-help-desk/authentication/providers');
        console.log('   2. Click "Get Started" (if you see it)');
        console.log('   3. Enable "Email/Password" provider');
        console.log('   4. Click "Save"');
        console.log('   5. Run this script again to verify\n');
      } else if (error.code === 'auth/email-already-in-use') {
        console.log('\n✅ Email/Password authentication is ENABLED');
        console.log('   (Test user already exists - this is fine!)');
        console.log('🎉 Your Firebase authentication is working correctly!\n');
      } else {
        console.log('\n⚠️  Unexpected error occurred');
        console.log('   Please check your Firebase configuration\n');
      }
      
      process.exit(error.code === 'auth/email-already-in-use' ? 0 : 1);
    });
    
} catch (error) {
  console.error('\n❌ Failed to initialize Firebase:', error.message);
  console.log('   Please check your Firebase configuration\n');
  process.exit(1);
}

// Timeout after 10 seconds
setTimeout(() => {
  console.log('\n⏱️  Request timeout - please check your internet connection\n');
  process.exit(1);
}, 10000);
