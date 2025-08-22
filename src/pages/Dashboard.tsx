import { Header } from "@/components/Header";
import { useIssues } from "@/hooks/useIssues";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
  pending: "hsl(var(--warning))",
  "in-progress": "hsl(var(--primary))",
  resolved: "hsl(var(--success))",
  high: "hsl(var(--destructive))",
  medium: "hsl(var(--warning))",
  low: "hsl(var(--muted-foreground))"
};

const Dashboard = () => {
  const { 
    issues, 
    loading, 
    error, 
    fetchIssues 
  } = useIssues();

  // Compute counts once for efficiency
  const statusCounts = {
    pending: issues.filter(issue => issue.status === "pending").length,
    inProgress: issues.filter(issue => issue.status === "in-progress").length,
    resolved: issues.filter(issue => issue.status === "resolved").length
  };

  const priorityCounts = {
    high: issues.filter(issue => issue.priority === "high").length,
    medium: issues.filter(issue => issue.priority === "medium").length,
    low: issues.filter(issue => issue.priority === "low").length
  };

  const totalIssues = issues.length;

  // Prepare data for charts
  const statusData = [
    { name: "Pending", value: statusCounts.pending, color: COLORS.pending },
    { name: "In Progress", value: statusCounts.inProgress, color: COLORS["in-progress"] },
    { name: "Resolved", value: statusCounts.resolved, color: COLORS.resolved }
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: "High", value: priorityCounts.high, color: COLORS.high },
    { name: "Medium", value: priorityCounts.medium, color: COLORS.medium },
    { name: "Low", value: priorityCounts.low, color: COLORS.low }
  ].filter(item => item.value > 0);

  const categoryData = issues.reduce((acc: any[], issue) => {
    const existing = acc.find(item => item.name === issue.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: issue.category, value: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value); // Sort descending for better visualization

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header pendingCount={0} />
        <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header pendingCount={0} />
        <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
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

  if (totalIssues === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header pendingCount={0} />
        <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <Card className="p-12">
            <CardContent className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
              <p className="text-muted-foreground mb-6">Start by reporting your first issue to see analytics here.</p>
              <Button asChild>
                <Link to="/">
                  <Plus className="h-4 w-4 mr-2" />
                  Report First Issue
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header pendingCount={statusCounts.pending} />
      
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of all issues</p>
          </div>
          <Button asChild size="sm">
            <Link to="/">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </Link>
          </Button>
        </div>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary Stats */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold text-primary">{totalIssues}</div>
                  <p className="text-xs text-muted-foreground">Total Issues</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <div className="text-2xl font-bold text-warning">{statusCounts.pending}</div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary">{statusCounts.inProgress}</div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="text-2xl font-bold text-success">{statusCounts.resolved}</div>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          {statusData.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Issues by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Priority Distribution */}
          {priorityData.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Issues by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Category Distribution */}
          {categoryData.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Issues by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tickMargin={10}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickMargin={5}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;