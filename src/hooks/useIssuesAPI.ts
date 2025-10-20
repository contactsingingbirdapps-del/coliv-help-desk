/**
 * Issues Hook - Backend API Version
 * Uses secure backend API instead of direct Firestore access
 */

import { useState, useEffect } from "react";
import { issuesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "resolved" | "closed";
  submittedBy: string;
  unit?: string;
  submittedAt: Date;
};

export type CreateIssueData = Omit<Issue, "id" | "submittedAt" | "status">;

export const useIssuesAPI = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isSkipped } = useAuth();

  // Demo data for non-authenticated users
  const demoIssues: Issue[] = [
    {
      id: 'demo-1',
      title: 'Water Leak in Kitchen',
      description: 'There is a small water leak under the kitchen sink',
      category: 'Plumbing',
      priority: 'high',
      status: 'pending',
      submittedBy: 'Demo User',
      unit: 'A101',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 'demo-2',
      title: 'Broken Light Bulb',
      description: 'Light bulb in the hallway needs replacement',
      category: 'Electrical',
      priority: 'medium',
      status: 'in-progress',
      submittedBy: 'Demo User',
      unit: 'A101',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'demo-3',
      title: 'Noise Complaint',
      description: 'Loud music from upstairs unit',
      category: 'Noise',
      priority: 'low',
      status: 'resolved',
      submittedBy: 'Demo User',
      unit: 'A101',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    }
  ];

  // Convert API issue to app issue format
  const convertApiIssue = (apiIssue: any): Issue => ({
    id: apiIssue.id,
    title: apiIssue.title,
    description: apiIssue.description,
    category: apiIssue.category,
    priority: apiIssue.priority as any,
    status: apiIssue.status as any,
    submittedBy: apiIssue.submitted_by || apiIssue.submittedBy || 'Unknown',
    unit: apiIssue.unit || undefined,
    submittedAt: new Date(apiIssue.created_at || apiIssue.createdAt),
  });

  // Fetch all issues from backend API
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Security: Show demo data only if not authenticated
      if (!user && !isSkipped) {
        setIssues(demoIssues);
        setLoading(false);
        return;
      }
      
      const { data, error: apiError } = await issuesAPI.getAll();

      if (apiError) {
        setError(apiError.message || 'Failed to fetch issues');
        toast({
          title: "Error Loading Issues",
          description: apiError.message || 'Failed to fetch issues',
          variant: "destructive",
        });
        return;
      }

      if (data && data.issues) {
        const convertedIssues = data.issues.map(convertApiIssue);
        setIssues(convertedIssues);
      } else {
        setIssues([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch issues';
      setError(errorMessage);
      toast({
        title: "Error Loading Issues",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new issue
  const createIssue = async (issueData: CreateIssueData) => {
    try {
      // Security: Require authentication to create issues
      if (!user && !isSkipped) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create issues.",
          variant: "destructive",
        });
        throw new Error('Authentication required');
      }
      
      const { data, error: apiError } = await issuesAPI.create({
        title: issueData.title,
        description: issueData.description,
        category: issueData.category,
        priority: issueData.priority,
        unit: issueData.unit,
        images: [],
      });

      if (apiError) {
        toast({
          title: "Error Creating Issue",
          description: apiError.message || 'Failed to create issue',
          variant: "destructive",
        });
        throw new Error(apiError.message);
      }

      if (data) {
        const newIssue = convertApiIssue(data);
        setIssues(prev => [newIssue, ...prev]);
        
        toast({
          title: "Issue Created",
          description: "Your issue has been reported successfully.",
        });

        return newIssue;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create issue';
      console.error('Error creating issue:', err);
      toast({
        title: "Error Creating Issue",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update issue status
  const updateIssueStatus = async (id: string, status: Issue["status"]) => {
    try {
      const { error: apiError } = await issuesAPI.update(id, { status });

      if (apiError) {
        console.error('Error updating issue:', apiError);
        toast({
          title: "Error Updating Issue",
          description: apiError.message || 'Failed to update issue',
          variant: "destructive",
        });
        throw new Error(apiError.message);
      }

      setIssues(prev => 
        prev.map(issue => 
          issue.id === id ? { ...issue, status } : issue
        )
      );

      toast({
        title: "Issue Updated",
        description: `Issue status changed to ${status.replace("-", " ")}.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update issue';
      console.error('Error updating issue:', err);
      toast({
        title: "Error Updating Issue",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Filter issues by status
  const filterIssuesByStatus = (status?: string) => {
    if (!status || status === "all") return issues;
    return issues.filter(issue => issue.status === status);
  };

  // Initialize data on mount and re-fetch when auth state changes
  useEffect(() => {
    fetchIssues();
  }, [user, isSkipped]); // Re-fetch when user logs in/out

  return {
    issues,
    loading,
    error,
    fetchIssues,
    createIssue,
    updateIssueStatus,
    filterIssuesByStatus,
  };
};
