# CoLiving Manager - Help Desk Application

A comprehensive help desk application designed for co-living communities to manage maintenance requests, track issues, and facilitate communication between residents and property management.

## 🚀 Features

### Core Functionality
- **Issue Reporting**: Submit and track maintenance requests and issues
- **Dashboard Analytics**: Visual charts and statistics for issue management
- **Resident Management**: Directory and profile management for community members
- **Payment Processing**: Handle service payments and maintenance fees
- **Real-time Updates**: Track issue status and receive notifications

### New Features (Latest Update)
- **Comprehensive Settings Page**: 
  - Profile management with editable fields
  - Notification preferences
  - App preferences (theme, language, timezone)
  - Privacy settings
  - Support and help resources
- **Privacy Policy Page**: Complete privacy policy with all required sections
- **Terms of Service Page**: Comprehensive terms covering all aspects of the app
- **Enhanced Authentication**: 
  - Improved signup/login flow
  - Password strength indicator
  - Form validation
  - Better error handling
- **User Profile Management**: 
  - Editable profile information
  - Database integration
  - Real-time updates

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Context + React Query
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Mobile**: Capacitor for cross-platform deployment

## 📱 Pages & Navigation

### Main Navigation
- **Dashboard** (`/dashboard`): Analytics and overview
- **Report Issue** (`/`): Submit new maintenance requests
- **Residents** (`/residents`): Community member directory
- **Payment** (`/payment`): Service payment processing
- **Settings** (`/settings`): User preferences and account management

### Additional Pages
- **Authentication** (`/auth`): Sign up, sign in, or skip auth
- **Privacy Policy** (`/privacy-policy`): Complete privacy information
- **Terms of Service** (`/terms`): Service terms and conditions

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cohub-help-desk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the migration to create the profiles table:
   ```sql
   -- This will be automatically applied when you run the app
   -- or you can manually run the migration in your Supabase dashboard
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🗄️ Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    unit TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Issues Table (existing)
- Standard issue tracking with categories, priorities, and status

## 🔐 Authentication & Security

- **Supabase Auth**: Secure user authentication
- **Row Level Security**: Database-level security policies
- **Profile Management**: User profile data with proper access controls
- **Skip Authentication**: Option to use app without account (limited features)

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: System preference detection
- **Accessibility**: ARIA labels and keyboard navigation
- **Mobile-First**: Optimized for mobile devices
- **Toast Notifications**: User feedback and status updates

## 📊 Analytics & Reporting

- **Issue Status Distribution**: Pie charts for issue status
- **Priority Analysis**: Visual priority breakdown
- **Category Trends**: Bar charts for issue categories
- **Real-time Updates**: Live data refresh capabilities

## 🔔 Notifications

- **Email Notifications**: Configurable email preferences
- **Push Notifications**: In-app notification system
- **Issue Updates**: Real-time status change notifications
- **Maintenance Alerts**: Important maintenance notifications
- **Community Announcements**: Community-wide updates

## 🚀 Deployment

### Web Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Mobile Deployment
```bash
npm run build
npx cap add android
npx cap add ios
npx cap sync
npx cap open android  # or ios
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: support@colivingmanager.com
- **Documentation**: Check the app's help center
- **Issues**: Use the GitHub issues page

## 🔄 Recent Updates

### v1.1.0 - Full App Functionality
- ✅ Complete Settings page with profile management
- ✅ Privacy Policy and Terms of Service pages
- ✅ Enhanced authentication flow with validation
- ✅ User profile database integration
- ✅ Improved navigation and user experience
- ✅ Production-ready error handling
- ✅ Comprehensive form validation
- ✅ Password strength indicators
- ✅ Mobile-responsive design improvements

### v1.0.0 - Initial Release
- ✅ Basic issue reporting and tracking
- ✅ Dashboard with analytics
- ✅ User authentication
- ✅ Basic navigation structure

---

**Built with ❤️ for co-living communities**
