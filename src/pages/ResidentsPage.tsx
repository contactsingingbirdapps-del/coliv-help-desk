import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usersAPI } from "@/services/api";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const ResidentsPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isSkipped } = useAuth();

  useEffect(() => {
    fetchProfiles();
  }, [user, isSkipped]); // Re-fetch when auth state changes

  const fetchProfiles = async () => {
    try {
      // Security: Show demo data only if user is not authenticated
      if (!user && !isSkipped) {
        setProfiles([
          {
            id: 'demo-1',
            user_id: 'demo-user-1',
            full_name: 'Demo Resident',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          }
        ]);
        setLoading(false);
        return;
      }
      
      // Fetch residents from backend API
      const { data, error: apiError } = await usersAPI.getAll({ role: 'resident' });

      if (apiError) {
        throw new Error(apiError.message || 'Failed to load residents');
      }

      if (data && data.users) {
        const residents: Profile[] = data.users.map((u: any) => ({
          id: u.id,
          user_id: u.id,
          full_name: u.fullName || u.full_name,
          avatar_url: u.avatarUrl || u.avatar_url || null,
        }));
        setProfiles(residents);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      // Show demo data on error
      setProfiles([
        {
          id: 'demo-1',
          user_id: 'demo-user-1',
          full_name: 'Demo Resident',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        }
      ]);
      toast({
        title: "Demo Mode",
        description: "Showing demo data. Sign in to view real residents.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Residents</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="h-4 bg-muted rounded w-24" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Residents</h1>
        </div>
        
        {profiles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No residents found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={profile.avatar_url || undefined} 
                      alt={profile.full_name || "User"} 
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {profile.full_name || "Anonymous User"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentsPage;