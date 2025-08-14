import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import StatsOverview from "@/components/StatsOverview";
import IssueForm from "@/components/IssueForm";
import IssueCard from "@/components/IssueCard";
import { Issue, IssueFormData, IssueStatus } from "@/types/issue";

// Mock data for demonstration
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Broken washing machine",
    description: "The washing machine in the laundry room is not spinning properly and makes loud noises.",
    category: "maintenance",
    priority: "high",
    status: "open",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Common area needs cleaning",
    description: "The kitchen area has not been cleaned in several days and needs attention.",
    category: "cleaning",
    priority: "medium",
    status: "in-progress",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "WiFi connection issues",
    description: "Internet connection is unstable in room 2B, frequent disconnections.",
    category: "utilities",
    priority: "urgent",
    status: "resolved",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-14"),
  },
];

const Index = () => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleSubmitIssue = (data: IssueFormData) => {
    const newIssue: Issue = {
      id: Date.now().toString(),
      ...data,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setIssues([newIssue, ...issues]);
  };

  const getFilteredIssues = (status: string) => {
    if (status === "all") return issues;
    return issues.filter(issue => issue.status === status);
  };

  const filteredIssues = getFilteredIssues(activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Issue Management Dashboard</h2>
          <p className="text-muted-foreground">Report and track issues in your coliving space</p>
        </div>

        <StatsOverview issues={issues} />

        <IssueForm onSubmit={handleSubmitIssue} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No issues found for this status.</p>
                <p className="text-muted-foreground">
                  {activeTab === "all" ? "Report your first issue to get started!" : `No ${activeTab} issues at the moment.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
