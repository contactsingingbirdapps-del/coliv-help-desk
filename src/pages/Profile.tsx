import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Bell, HelpCircle, Shield, Info } from "lucide-react";
import { useIssues } from "@/hooks/useIssues";

const Profile = () => {
  const { issues } = useIssues();
  
  const userStats = {
    totalIssues: issues.length,
    pendingIssues: issues.filter(issue => issue.status === "pending").length,
    resolvedIssues: issues.filter(issue => issue.status === "resolved").length,
  };

  const menuItems = [
    {
      icon: Settings,
      title: "General Settings",
      description: "App preferences and configurations",
      badge: null
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage your notification preferences",
      badge: null
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Control your privacy settings",
      badge: null
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help and contact support",
      badge: null
    },
    {
      icon: Info,
      title: "About",
      description: "App information and version details",
      badge: "v1.0.0"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header pendingCount={userStats.pendingIssues} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.totalIssues}</div>
              <p className="text-sm text-muted-foreground">Total Issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-warning">{userStats.pendingIssues}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-success">{userStats.resolvedIssues}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Settings Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Settings & More</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {menuItems.map((item) => (
              <div 
                key={item.title}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {item.badge && (
                  <Badge variant="secondary">{item.badge}</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About CoHub Help Desk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              A community-driven platform for managing and tracking issues in your coliving space. 
              Report problems, track their progress, and stay connected with your community.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Version 1.0.0</span>
              <span className="text-muted-foreground">Built with ❤️ for coliving communities</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;