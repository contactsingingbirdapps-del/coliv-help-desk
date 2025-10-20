# 🔐 Backend Integration Guide

## Overview

This guide explains how the frontend is integrated with the backend API for enhanced security.

## Architecture

### Before Integration
- Frontend directly accessed Firestore
- Firebase credentials exposed in frontend
- No centralized security layer
- Limited access control

### After Integration
- Frontend communicates with backend API
- Firebase Admin SDK on backend (more secure)
- Centralized authentication & authorization
- Role-based access control
- Rate limiting and validation

## Security Benefits

1. **API Key Protection**: Firebase Admin SDK credentials stay on server
2. **Token Verification**: Backend verifies Firebase ID tokens
3. **Role-Based Access**: Backend enforces user permissions
4. **Input Validation**: All inputs validated on server
5. **Rate Limiting**: Prevents abuse (100 req/15min)
6. **CORS Protection**: Only allowed origins can access API

## Files Created

### 1. API Service Layer (`src/services/api.ts`)
- Centralized API communication
- Automatic token handling
- Type-safe API calls
- Error handling

### 2. Updated Auth Context (`src/contexts/AuthContext.tsx`)
- Uses backend API for profile operations
- Keeps Firebase Auth for authentication
- Secure profile updates

### 3. New Hooks (`src/hooks/useIssuesAPI.ts`)
- Backend-powered data fetching
- Real-time updates via API
- Better error handling

## Usage Examples

### 1. Fetching Issues

```typescript
import { issuesAPI } from '@/services/api';

// Get all issues
const { data, error } = await issuesAPI.getAll({
  page: 1,
  limit: 50,
  status: 'pending'
});

if (error) {
  console.error('Error:', error);
} else {
  console.log('Issues:', data.issues);
}
```

### 2. Creating an Issue

```typescript
import { issuesAPI } from '@/services/api';

const { data, error } = await issuesAPI.create({
  title: 'Water Leak',
  description: 'Kitchen sink is leaking',
  category: 'maintenance',
  priority: 'high',
  unit: 'A101',
});

if (error) {
  console.error('Error creating issue:', error);
} else {
  console.log('Issue created:', data);
}
```

### 3. Updating Profile

```typescript
import { authAPI } from '@/services/api';

const { error } = await authAPI.updateProfile({
  fullName: 'John Doe',
  phone: '+1234567890',
  unit: 'A101',
});

if (error) {
  console.error('Error updating profile:', error);
} else {
  console.log('Profile updated successfully');
}
```

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete account

### Issues
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get single issue
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `GET /api/issues/stats/summary` - Get statistics

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/residents` - Get residents
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Properties (Admin/Owner Only)
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Payments (Admin/Owner Only)
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment
- `PUT /api/payments/:id` - Update payment
- `GET /api/payments/stats/summary` - Get statistics

## How It Works

### 1. Authentication Flow

```
┌─────────┐           ┌─────────────┐           ┌─────────┐
│ Frontend│           │   Firebase  │           │ Backend │
└────┬────┘           │     Auth    │           └────┬────┘
     │                └──────┬──────┘                │
     │  Sign In             │                        │
     ├──────────────────────>                        │
     │                      │                        │
     │  ID Token            │                        │
     <──────────────────────┤                        │
     │                      │                        │
     │  API Request (with token)                     │
     ├───────────────────────────────────────────────>
     │                      │                        │
     │                      │   Verify Token         │
     │                      <────────────────────────┤
     │                      │                        │
     │                      │   User Data            │
     │                      ├───────────────────────>│
     │                      │                        │
     │  Response                                     │
     <───────────────────────────────────────────────┤
```

### 2. API Request Flow

1. **User Action**: User performs action in frontend
2. **Get Token**: Frontend gets Firebase ID token
3. **Make Request**: Send request to backend with token
4. **Verify Token**: Backend verifies token with Firebase
5. **Check Permissions**: Backend checks user role/permissions
6. **Execute Action**: Perform database operation
7. **Return Response**: Send response back to frontend

## Environment Variables

### Frontend (`.env.local`)
```bash
# Firebase Configuration (for client-side auth)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Backend API URL
VITE_API_URL=http://localhost:3001/api
```

### Backend (`.env`)
```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Server Configuration
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-secret-key

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Migration Guide

### Step 1: Update Components

Replace direct Firestore calls with API calls:

**Before:**
```typescript
import { db } from '@/integrations/firebase/client';
import { collection, getDocs } from 'firebase/firestore';

const snapshot = await getDocs(collection(db, 'issues'));
const issues = snapshot.docs.map(doc => doc.data());
```

**After:**
```typescript
import { issuesAPI } from '@/services/api';

const { data, error } = await issuesAPI.getAll();
const issues = data?.issues || [];
```

### Step 2: Use New Hooks

Replace old hooks with API-powered hooks:

**Before:**
```typescript
import { useIssues } from '@/hooks/useIssues';

const { issues, createIssue } = useIssues();
```

**After:**
```typescript
import { useIssuesAPI } from '@/hooks/useIssuesAPI';

const { issues, createIssue } = useIssuesAPI();
```

### Step 3: Update Dashboard

Update Dashboard component to use the API service:

```typescript
import API from '@/services/api';

// Fetch stats
const { data: issueStats } = await API.issues.getStats();
const { data: propertyStats } = await API.properties.getStats();
```

## Testing

### 1. Start Backend
```bash
cd backend
npm start
```

Backend runs on: http://localhost:3001

### 2. Start Frontend
```bash
cd cohub-help-desk
npm run dev
```

Frontend runs on: http://localhost:5173

### 3. Test Authentication
1. Sign up for a new account
2. Check backend logs for token verification
3. Profile should load from backend API

### 4. Test Issue Creation
1. Create a new issue
2. Check backend logs for API call
3. Issue should appear in list

### 5. Test API Health
```bash
# Check backend health
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly
- Check browser console for specific origin

### Authentication Errors
- Verify Firebase Auth is enabled
- Check Firebase ID token is being sent
- Check backend logs for token verification errors

### API Not Responding
- Ensure backend server is running
- Check backend port (default: 3001)
- Verify `VITE_API_URL` in frontend `.env.local`

### Database Errors
- Check Firebase credentials in backend `.env`
- Verify Firestore rules allow backend access
- Check backend logs for specific errors

## Next Steps

1. **Update All Components**: Migrate remaining components to use API
2. **Add More Hooks**: Create hooks for properties, payments, users
3. **Error Handling**: Implement global error handling
4. **Loading States**: Add consistent loading indicators
5. **Caching**: Implement data caching for better performance

## Security Checklist

- [ ] Backend `.env` is in `.gitignore`
- [ ] Frontend `.env.local` is in `.gitignore`
- [ ] Firebase Admin SDK credentials secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Authentication required for sensitive endpoints
- [ ] Role-based access control implemented

## Resources

- [Backend API Documentation](../backend/API_DOCUMENTATION.md)
- [Backend README](../backend/README.md)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
