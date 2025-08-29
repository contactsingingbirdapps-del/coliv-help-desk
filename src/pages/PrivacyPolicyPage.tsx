import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, Eye, Database, Users, Lock, Mail, Phone, Globe } from "lucide-react";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: January 1, 2024</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                At CoLiving Manager ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our help desk application and related services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
              <CardDescription>
                We collect several types of information to provide and improve our services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground">For account creation and communication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">For personalization and identification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-sm text-muted-foreground">Optional for emergency contact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Database className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Unit/Apartment</p>
                      <p className="text-sm text-muted-foreground">For issue tracking and location services</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Usage Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Issue reports and maintenance requests</li>
                  <li>• Communication history with support staff</li>
                  <li>• App usage patterns and preferences</li>
                  <li>• Device information and technical logs</li>
                  <li>• Location data (if enabled)</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Automatically Collected Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• IP address and device identifiers</li>
                  <li>• Browser type and version</li>
                  <li>• Operating system information</li>
                  <li>• App performance and error logs</li>
                  <li>• Cookies and similar technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
              <CardDescription>
                We use the collected information for various purposes to improve our services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium">Service Provision</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Process and track issue reports</li>
                    <li>• Provide customer support</li>
                    <li>• Send important notifications</li>
                    <li>• Manage user accounts</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Communication</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Respond to inquiries</li>
                    <li>• Send service updates</li>
                    <li>• Provide maintenance alerts</li>
                    <li>• Community announcements</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Improvement</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve app functionality</li>
                    <li>• Develop new features</li>
                    <li>• Optimize performance</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Security</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Prevent fraud and abuse</li>
                    <li>• Ensure data security</li>
                    <li>• Comply with legal obligations</li>
                    <li>• Protect user rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Information Sharing and Disclosure
              </CardTitle>
              <CardDescription>
                We do not sell your personal information and limit sharing to specific circumstances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">We Do Not Sell Your Data</h5>
                  <p className="text-sm text-muted-foreground">
                    We do not sell, trade, or otherwise transfer your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium mb-2">Limited Sharing</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    We may share your information only in the following circumstances:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our app</li>
                    <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li>• <strong>Community Management:</strong> With property managers and maintenance staff to resolve issues</li>
                    <li>• <strong>Emergency Situations:</strong> In emergency situations where safety is at risk</li>
                    <li>• <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h5 className="font-medium mb-2">Data Protection</h5>
                  <p className="text-sm text-muted-foreground">
                    All third-party service providers are contractually obligated to protect your information and use it only for specified purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Data Security
              </CardTitle>
              <CardDescription>
                We implement comprehensive security measures to protect your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium">Technical Safeguards</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Encryption in transit and at rest</li>
                    <li>• Secure authentication systems</li>
                    <li>• Regular security audits</li>
                    <li>• Access controls and monitoring</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Organizational Measures</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Employee training on data protection</li>
                    <li>• Strict access policies</li>
                    <li>• Incident response procedures</li>
                    <li>• Regular policy reviews</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but commit to promptly addressing any security concerns.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Your Privacy Rights
              </CardTitle>
              <CardDescription>
                You have certain rights regarding your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium">Access and Control</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Access your personal data</li>
                    <li>• Update or correct information</li>
                    <li>• Delete your account</li>
                    <li>• Export your data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Communication Preferences</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Opt-out of marketing emails</li>
                    <li>• Control notification settings</li>
                    <li>• Manage privacy preferences</li>
                    <li>• Request data restrictions</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                To exercise these rights, contact us at privacy@colivingmanager.com. We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Retention
              </CardTitle>
              <CardDescription>
                We retain your information only as long as necessary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium">Active Accounts</h5>
                  <p className="text-sm text-muted-foreground">
                    We retain your information while your account is active and for as long as needed to provide our services.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium">Account Deletion</h5>
                  <p className="text-sm text-muted-foreground">
                    When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium">Legal Requirements</h5>
                  <p className="text-sm text-muted-foreground">
                    Some information may be retained longer if required by law, regulation, or legitimate business purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Changes to This Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For significant changes, we will provide additional notice through email or in-app notifications. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Us
              </CardTitle>
              <CardDescription>
                If you have questions about this Privacy Policy, please contact us
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Email</h5>
                  <p className="text-sm text-muted-foreground">privacy@colivingmanager.com</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Address</h5>
                  <p className="text-sm text-muted-foreground">
                    CoLiving Manager<br />
                    123 Privacy Street<br />
                    Security City, SC 12345<br />
                    United States
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                We are committed to addressing your privacy concerns and will respond to your inquiry within 48 hours.
              </p>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="flex justify-center pt-6">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Previous Page
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
