import { Header } from "@/components/Header";
import { IssueForm } from "@/components/IssueForm";
import { IssueCard } from "@/components/IssueCard";
import { StatsOverview } from "@/components/StatsOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIssuesAPI as useIssues } from "@/hooks/useIssuesAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Index = () => {
  const { 
    issues, 
    loading, 
    error, 
    createIssue, 
    filterIssuesByStatus, 
    fetchIssues, 
    isDemoMode 
  } = useIssues();

  const handleNewIssue = async (newIssue: Parameters<typeof createIssue>[0]) => {
    await createIssue(newIssue);
  };

  const pendingCount = issues.filter(issue => issue.status === "pending").length;

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
          <Skeleton className="h-32 w-full mb-6" />
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
                <h3 className="text-lg font-semibold mb-2">Failed to Load Issues</h3>
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
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Demo Mode
                </p>
                <p className="text-sm text-blue-700">
                  Showing demo data due to database connection issues
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={fetchIssues}
                className="text-sm font-medium text-blue-800 hover:text-blue-900 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Report Issue</h1>
            <p className="text-muted-foreground">Help us improve your living experience</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
        
        <StatsOverview issues={issues} />
        
        <IssueForm onSubmit={handleNewIssue} />
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            {filterIssuesByStatus("all").map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4 mt-6">
            {filterIssuesByStatus("pending").map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </TabsContent>
          
          <TabsContent value="in-progress" className="space-y-4 mt-6">
            {filterIssuesByStatus("in-progress").map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </TabsContent>
          
          <TabsContent value="resolved" className="space-y-4 mt-6">
            {filterIssuesByStatus("resolved").map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </TabsContent>
        </Tabs>
        
        {!loading && issues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No issues reported yet. Use the form above to report your first issue.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
