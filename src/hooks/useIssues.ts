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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  // Demo data fallback for when database fails
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
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
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
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
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
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    }
  ];

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

  // Fetch all issues with fallback to demo data
  const fetchIssues = async () => {
    try {
      console.log("🔍 useIssues: Starting fetchIssues");
      setLoading(true);
      setError(null);
      setIsDemoMode(false);
      
      console.log("🔍 useIssues: Querying database for issues...");
      
      const fetchPromise = supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fast timeout (UX-first): 2.5s
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 2500)
      );
      
      let data: any, fetchError: any;
      
      try {
        const result = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]);
        data = result.data;
        fetchError = result.error;
      } catch (timeoutError) {
        console.warn("⏳ useIssues: Timed out at 2.5s, showing demo and continuing in background");
        setIssues(demoIssues);
        setIsDemoMode(true);
        setLoading(false);
        
        // Background refresh with longer window (8s)
        (async () => {
          try {
            const { data: bgData, error: bgError } = await supabase
              .from('issues')
              .select('*')
              .order('created_at', { ascending: false });
            if (!bgError && bgData && bgData.length > 0) {
              const converted = bgData.map(convertDbIssue);
              setIssues(converted);
              setIsDemoMode(false);
              console.log("✅ useIssues: Background refresh loaded live data");
            }
          } catch (e) {
            // ignore background errors
          }
        })();
        return;
      }
      
      console.log("🔍 useIssues: Database response:", { 
        data: data ? `${data.length} rows` : 'null', 
        error: fetchError,
        hasData: !!data,
        dataType: typeof data
      });

      if (fetchError) {
        console.error("❌ useIssues: Database query error:", fetchError);
        console.log("🔍 useIssues: Falling back to demo data due to query error");
        setIssues(demoIssues);
        setIsDemoMode(true);
        return;
      }

      if (!data || data.length === 0) {
        console.log("🔍 useIssues: No data returned, showing demo data");
        setIssues(demoIssues);
        setIsDemoMode(true);
        return;
      }

      const convertedIssues = data.map(convertDbIssue);
      console.log("🔍 useIssues: Converted issues:", convertedIssues);
      
      setIssues(convertedIssues);
      console.log("✅ useIssues: Successfully set issues from database");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch issues';
      console.error("❌ useIssues: Exception caught:", err);
      console.log("🔍 useIssues: Falling back to demo data due to exception");
      
      setIssues(demoIssues);
      setIsDemoMode(true);
      setError(null); // Clear error since we're showing demo data
      
      toast({
        title: "Demo Mode",
        description: "Showing demo data due to connection issues",
        variant: "default",
      });
    } finally {
      console.log("🔍 useIssues: Finally block - setting loading to false");
      setLoading(false);
    }
  };

  // Create a new issue
  const createIssue = async (issueData: CreateIssueData) => {
    try {
      console.log("🔍 useIssues: Creating issue:", issueData);
      
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
    console.log("🔄 useIssues: useEffect triggered, calling fetchIssues");
    fetchIssues();
  }, []);

  // Debug logging
  console.log("🔍 useIssues: Current state:", {
    issuesCount: issues.length,
    loading,
    error,
    isDemoMode
  });

  return {
    issues,
    loading,
    error,
    isDemoMode,
    fetchIssues,
    createIssue,
    updateIssueStatus,
    filterIssuesByStatus,
  };
};