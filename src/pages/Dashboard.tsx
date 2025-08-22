import { Header } from "@/components/Header";
import { IssueCard } from "@/components/IssueCard";
import { StatsOverview } from "@/components/StatsOverview";
import { useIssues } from "@/hooks/useIssues";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { 
    issues, 
    loading, 
    error, 
    filterIssuesByStatus, 
    fetchIssues 
  } = useIssues();

  const pendingCount = issues.filter(issue => issue.status === "pending").length;
  const openIssues = filterIssuesByStatus("pending").concat(filterIssuesByStatus("in-progress"));
  const resolvedIssues = filterIssuesByStatus("resolved");

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header pendingCount={0} />
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header pendingCount={0} />
        <main className="container mx-auto px-4 py-6">
          <Card className="p-6">
            <CardContent className="flex flex-col items-center gap-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchIssues}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header pendingCount={pendingCount} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button asChild size="sm">
            <Link to="/">
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
            </Link>
          </Button>
        </div>
        
        <StatsOverview issues={issues} />
        
        {/* Open Issues Section */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Open Issues</span>
              <Badge variant="secondary">{openIssues.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openIssues.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No open issues at the moment</p>
            ) : (
              <div className="space-y-3">
                {openIssues.slice(0, 3).map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
                {openIssues.length > 3 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      +{openIssues.length - 3} more open issues
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resolved Issues Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Recently Resolved</span>
              <Badge variant="outline" className="text-success border-success">{resolvedIssues.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resolvedIssues.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No resolved issues yet</p>
            ) : (
              <div className="space-y-3">
                {resolvedIssues.slice(0, 3).map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
                {resolvedIssues.length > 3 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      +{resolvedIssues.length - 3} more resolved issues
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;