import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  HelpCircle, 
  FileText, 
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    unit: profile?.unit || '',
    bio: profile?.bio || ''
  });
  
  // Update profile data when profile changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.full_name || user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        unit: profile.unit || '',
        bio: profile.bio || ''
      });
    }
  }, [profile, user]);
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    issueUpdates: true,
    maintenanceAlerts: true,
    communityAnnouncements: false,
    weeklyDigest: true
  });
  
  // App preferences
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    autoRefresh: true,
    compactMode: false,
    showTutorials: true
  });
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'community',
    showEmail: false,
    showPhone: false,
    allowContact: true,
    dataAnalytics: true
  });

  const handleProfileSave = async () => {
    try {
      const { error } = await updateProfile({
        full_name: profileData.fullName,
        phone: profileData.phone,
        unit: profileData.unit,
        bio: profileData.bio
      });

      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: string | boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would typically delete the user account
      toast({
        title: "Account Deletion",
        description: "Account deletion request submitted. You will receive a confirmation email.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header pendingCount={0} />
      
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden md:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit/Apartment</Label>
                    <Input
                      id="unit"
                      value={profileData.unit}
                      onChange={(e) => setProfileData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., Apt 101, Unit 2B"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us a bit about yourself"
                  />
                </div>
                <Button onClick={handleProfileSave} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                  Manage your account settings and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">What to notify me about</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Issue Updates</h5>
                      <p className="text-sm text-muted-foreground">
                        When your reported issues are updated
                      </p>
                    </div>
                    <Switch
                      checked={notifications.issueUpdates}
                      onCheckedChange={() => handleNotificationToggle('issueUpdates')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Maintenance Alerts</h5>
                      <p className="text-sm text-muted-foreground">
                        Important maintenance notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.maintenanceAlerts}
                      onCheckedChange={() => handleNotificationToggle('maintenanceAlerts')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Community Announcements</h5>
                      <p className="text-sm text-muted-foreground">
                        Updates from your community
                      </p>
                    </div>
                    <Switch
                      checked={notifications.communityAnnouncements}
                      onCheckedChange={() => handleNotificationToggle('communityAnnouncements')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Weekly Digest</h5>
                      <p className="text-sm text-muted-foreground">
                        Summary of weekly activities
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>
                  Customize your app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => handlePreferenceChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => handlePreferenceChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) => handlePreferenceChange('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Display Options</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Auto Refresh</h5>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh data every 5 minutes
                      </p>
                    </div>
                    <Switch
                      checked={preferences.autoRefresh}
                      onCheckedChange={(checked) => handlePreferenceChange('autoRefresh', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Compact Mode</h5>
                      <p className="text-sm text-muted-foreground">
                        Use compact layout for better space utilization
                      </p>
                    </div>
                    <Switch
                      checked={preferences.compactMode}
                      onCheckedChange={(checked) => handlePreferenceChange('compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Show Tutorials</h5>
                      <p className="text-sm text-muted-foreground">
                        Display helpful tips and tutorials
                      </p>
                    </div>
                    <Switch
                      checked={preferences.showTutorials}
                      onCheckedChange={(checked) => handlePreferenceChange('showTutorials', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Everyone can see</SelectItem>
                        <SelectItem value="community">Community - Only residents can see</SelectItem>
                        <SelectItem value="private">Private - Only you can see</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Contact Information</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Show Email Address</h5>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your email address
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Show Phone Number</h5>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your phone number
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Allow Direct Contact</h5>
                        <p className="text-sm text-muted-foreground">
                          Allow other residents to contact you directly
                        </p>
                      </div>
                      <Switch
                        checked={privacy.allowContact}
                        onCheckedChange={(checked) => handlePrivacyChange('allowContact', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Data Analytics</h5>
                      <p className="text-sm text-muted-foreground">
                        Help improve the app by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch
                      checked={privacy.dataAnalytics}
                      onCheckedChange={(checked) => handlePrivacyChange('dataAnalytics', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>
                  Get help and learn more about the app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                    <HelpCircle className="h-5 w-5" />
                    <div className="text-left">
                      <h4 className="font-medium">Help Center</h4>
                      <p className="text-sm text-muted-foreground">Browse help articles and guides</p>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => navigate('/privacy-policy')}
                  >
                    <FileText className="h-5 w-5" />
                    <div className="text-left">
                      <h4 className="font-medium">Privacy Policy</h4>
                      <p className="text-sm text-muted-foreground">Read our privacy policy</p>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => navigate('/terms')}
                  >
                    <Globe className="h-5 w-5" />
                    <div className="text-left">
                      <h4 className="font-medium">Terms of Service</h4>
                      <p className="text-sm text-muted-foreground">Read our terms of service</p>
                    </div>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                    <User className="h-5 w-5" />
                    <div className="text-left">
                      <h4 className="font-medium">Contact Support</h4>
                      <p className="text-sm text-muted-foreground">Get in touch with our team</p>
                    </div>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">App Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Version: 1.0.0</p>
                    <p>Build: 2024.01.01</p>
                    <p>© 2024 CoLiving Manager. All rights reserved.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
