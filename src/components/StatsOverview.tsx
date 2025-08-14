import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types/issue";
import { AlertCircle, Clock, CheckCircle, FileText } from "lucide-react";

interface StatsOverviewProps {
  issues: Issue[];
}

const StatsOverview = ({ issues }: StatsOverviewProps) => {
  const openIssues = issues.filter(issue => issue.status === 'open').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'in-progress').length;
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;
  const totalIssues = issues.length;

  const stats = [
    {
      title: "Total Issues",
      value: totalIssues,
      icon: FileText,
      color: "bg-muted text-muted-foreground"
    },
    {
      title: "Open Issues",
      value: openIssues,
      icon: AlertCircle,
      color: "bg-destructive text-destructive-foreground"
    },
    {
      title: "In Progress",
      value: inProgressIssues,
      icon: Clock,
      color: "bg-warning text-warning-foreground"
    },
    {
      title: "Resolved",
      value: resolvedIssues,
      icon: CheckCircle,
      color: "bg-success text-success-foreground"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;