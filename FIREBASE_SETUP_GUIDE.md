# 🔧 Firebase Authentication Setup Guide

## 🚨 **The Problem**
You're getting a 400 Bad Request error when trying to sign in:
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD2wG7O9LuceFRBbvr9mFVKu62OYFclxEE 400 (Bad Request)
```

This error indicates that **Email/Password Authentication is not enabled** in your Firebase project.

## ✅ **Quick Fix Steps**

### **Step 1: Enable Email/Password Authentication**

1. **Go to Firebase Console**: https://console.firebase.google.com/project/coliv-management-help-desk/authentication/providers

2. **Click on "Authentication"** in the left sidebar

3. **Go to "Sign-in method" tab**

4. **Find "Email/Password" provider** and click on it

5. **Enable the first toggle** (Email/Password)

6. **Click "Save"**

### **Step 2: Create a Test User**

1. **Go to Users tab**: https://console.firebase.google.com/project/coliv-management-help-desk/authentication/users

2. **Click "Add user"**

3. **Enter test credentials**:
   - Email: `test@example.com`
   - Password: `testpassword123`

4. **Click "Add user"**

### **Step 3: Test the Fix**

1. **Restart your development server**:
   ```bash
   cd cohub-help-desk
   npm run dev
   ```

2. **Go to the Debug tab** in the authentication page

3. **Click "Test Firebase Connection"**

4. **Check the results** - you should see all green checkmarks ✅

## 🔍 **Verification Checklist**

- [ ] Email/Password authentication is enabled in Firebase Console
- [ ] Test user exists in Firebase Console
- [ ] Environment variables are set correctly (`.env.local` file)
- [ ] Firebase project is active (not suspended)
- [ ] API key is correct

## 🧪 **Using the Debug Tool**

The app now includes a built-in Firebase test tool:

1. **Go to the authentication page**
2. **Click on the "Debug" tab**
3. **Click "Test Firebase Connection"**
4. **Review the test results**

The debug tool will:
- ✅ Check Firebase Auth availability
- ✅ Check Firestore availability  
- ✅ Test user creation
- ✅ Test Firestore read/write
- ✅ Provide specific error solutions

## 🚀 **Expected Results**

After enabling Email/Password authentication:

- ✅ No more 400 Bad Request errors
- ✅ Authentication works properly
- ✅ Users can sign in successfully
- ✅ Debug tool shows all tests passing

## 🔧 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| `auth/operation-not-allowed` | Enable Email/Password in Firebase Console |
| `auth/user-not-found` | Create user in Firebase Console |
| `auth/wrong-password` | Check password or create new user |
| `auth/weak-password` | Use password with at least 6 characters |
| `auth/invalid-email` | Use valid email format |

## 📞 **Still Having Issues?**

1. **Check the Debug tab** for specific error messages
2. **Verify Firebase Console settings**
3. **Check browser console** for detailed errors
4. **Ensure project is not suspended**

The most common fix is simply **enabling Email/Password authentication** in the Firebase Console! 🎉
