import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type DatabaseIssue = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "resolved";
  submitted_by: string;
  unit: string | null;
  created_at: string;
  updated_at: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "resolved";
  submittedBy: string;
  unit?: string;
  submittedAt: Date;
};

export type CreateIssueData = Omit<Issue, "id" | "submittedAt" | "status">;

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert database issue to app issue format
  const convertDbIssue = (dbIssue: any): Issue => ({
    id: dbIssue.id,
    title: dbIssue.title,
    description: dbIssue.description,
    category: dbIssue.category,
    priority: dbIssue.priority as "low" | "medium" | "high",
    status: dbIssue.status as "pending" | "in-progress" | "resolved",
    submittedBy: dbIssue.submitted_by,
    unit: dbIssue.unit || undefined,
    submittedAt: new Date(dbIssue.created_at),
  });

  // Fetch all issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const convertedIssues = data?.map(convertDbIssue) || [];
      setIssues(convertedIssues);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch issues';
      setError(errorMessage);
      console.error('Error fetching issues:', err);
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
      const dbData = {
        title: issueData.title,
        description: issueData.description,
        category: issueData.category,
        priority: issueData.priority,
        submitted_by: issueData.submittedBy,
        unit: issueData.unit || null,
      };

      const { data, error: createError } = await supabase
        .from('issues')
        .insert([dbData])
        .select()
        .single();

      if (createError) throw createError;

      const newIssue = convertDbIssue(data as any);
      setIssues(prev => [newIssue, ...prev]);
      
      toast({
        title: "Issue Created",
        description: "Your issue has been reported successfully.",
      });

      return newIssue;
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
      const { error: updateError } = await supabase
        .from('issues')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

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

  // Initialize data on mount
  useEffect(() => {
    fetchIssues();
  }, []);

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