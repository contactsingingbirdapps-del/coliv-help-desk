import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Shield, Users, Globe, AlertTriangle, CheckCircle } from "lucide-react";

const TermsPage = () => {
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
            <h1 className="text-2xl font-bold">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: January 1, 2024</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service ("Terms") govern your use of the CoLiving Manager application and related services ("Service") operated by CoLiving Manager ("we," "our," or "us").
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                CoLiving Manager is a help desk application designed to facilitate communication between residents and property management. Our Service includes:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Issue reporting and tracking</li>
                <li>• Maintenance request management</li>
                <li>• Community communication tools</li>
                <li>• Payment processing for services</li>
                <li>• Resident directory and profiles</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Account Creation</h4>
                  <p className="text-sm text-muted-foreground">
                    When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account credentials.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Responsibilities</h4>
                  <p className="text-sm text-muted-foreground">
                    You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Termination</h4>
                  <p className="text-sm text-muted-foreground">
                    We reserve the right to terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Acceptable Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Infringe on intellectual property rights</li>
                  <li>• Harass, abuse, or harm other users</li>
                  <li>• Submit false or misleading information</li>
                  <li>• Attempt to gain unauthorized access</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Interfere with service operation</li>
                  <li>• Use automated systems to access the service</li>
                  <li>• Transmit viruses or malicious code</li>
                  <li>• Engage in spam or unsolicited communications</li>
                  <li>• Violate community guidelines</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Content and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Content and Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">User Content</h4>
                  <p className="text-sm text-muted-foreground">
                    You retain ownership of content you submit to our Service. By submitting content, you grant us a license to use, store, and display that content in connection with the Service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Privacy Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Security</h4>
                  <p className="text-sm text-muted-foreground">
                    We implement reasonable security measures to protect your information, but no method of transmission over the internet is 100% secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Service Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Some features of our Service may require payment. All fees are clearly displayed before you make a purchase.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Payments are processed through secure third-party payment processors. We do not store your payment card information.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Refunds</h4>
                  <p className="text-sm text-muted-foreground">
                    Refund policies vary by service type. Please contact our support team for specific refund inquiries.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Our Rights</h4>
                  <p className="text-sm text-muted-foreground">
                    The Service and its original content, features, and functionality are owned by CoLiving Manager and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Your Rights</h4>
                  <p className="text-sm text-muted-foreground">
                    You retain ownership of content you create and submit. You grant us a non-exclusive, worldwide, royalty-free license to use your content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Service Availability</h4>
                  <p className="text-sm text-muted-foreground">
                    We strive to provide reliable service but cannot guarantee uninterrupted access. The Service is provided "as is" without warranties of any kind.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Limitation of Liability</h4>
                  <p className="text-sm text-muted-foreground">
                    In no event shall CoLiving Manager be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Third-Party Services</h4>
                  <p className="text-sm text-muted-foreground">
                    Our Service may contain links to third-party websites or services. We are not responsible for the content or practices of these third-party services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Termination by You</h4>
                  <p className="text-sm text-muted-foreground">
                    You may terminate your account at any time by contacting our support team or using the account deletion feature in your settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Termination by Us</h4>
                  <p className="text-sm text-muted-foreground">
                    We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Effect of Termination</h4>
                  <p className="text-sm text-muted-foreground">
                    Upon termination, your right to use the Service will cease immediately. We may delete your account and data in accordance with our Privacy Policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms will be resolved in the courts of the United States.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What constitutes a material change will be determined at our sole discretion. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>
                If you have questions about these Terms of Service, please contact us
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Email</h5>
                  <p className="text-sm text-muted-foreground">legal@colivingmanager.com</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Address</h5>
                  <p className="text-sm text-muted-foreground">
                    CoLiving Manager<br />
                    123 Legal Street<br />
                    Compliance City, CC 12345<br />
                    United States
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                We are committed to addressing your concerns and will respond to your inquiry within 48 hours.
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

export default TermsPage;
