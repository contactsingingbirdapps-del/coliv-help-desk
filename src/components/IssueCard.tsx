import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types/issue";
import { Clock, AlertTriangle, Wrench, Trash2, Volume2, Zap, Shield, HelpCircle } from "lucide-react";

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return Wrench;
      case 'cleaning': return Trash2;
      case 'noise': return Volume2;
      case 'utilities': return Zap;
      case 'safety': return Shield;
      default: return HelpCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-destructive text-destructive-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const Icon = getCategoryIcon(issue.category);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{issue.title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Badge className={getPriorityColor(issue.priority)}>
              {issue.priority}
            </Badge>
            <Badge className={getStatusColor(issue.status)}>
              {issue.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3">{issue.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="capitalize">{issue.category}</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{issue.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;