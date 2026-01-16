import { useState } from "react";
import { useEmails, useSummarizeEmail, useDeleteEmail, useRunWorkflow } from "@/hooks/use-emails";
import { EmailList } from "@/components/EmailList";
import { Button } from "@/components/ui/button";
import { Plus, Play, Filter, Inbox, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: emails = [], isLoading, error } = useEmails();
  const summarizeMutation = useSummarizeEmail();
  const deleteMutation = useDeleteEmail();
  const runWorkflowMutation = useRunWorkflow();

  const [filter, setFilter] = useState<string>("all");

  const categories = Array.from(new Set(emails.map((e) => e.category).filter(Boolean))) as string[];

  const filteredEmails = emails.filter((email) => {
    if (filter === "all") return true;
    if (filter === "pending") return !email.isProcessed;
    return email.category === filter;
  });

  // Stats for the hero cards
  const totalEmails = emails.length;
  const processedEmails = emails.filter(e => e.isProcessed).length;
  const pendingEmails = totalEmails - processedEmails;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
              Inbox Intelligence
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              AI-powered summarization and categorization workflow.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              size="lg"
              onClick={() => runWorkflowMutation.mutate()} 
              disabled={runWorkflowMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
            >
              {runWorkflowMutation.isPending ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : (
                <Play className="w-4 h-4 mr-2 fill-current" />
              )}
              Run Workflow
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard 
            title="Total Messages" 
            value={totalEmails} 
            icon={<Inbox className="w-5 h-5 text-blue-500" />}
            className="bg-blue-50/50 border-blue-100"
          />
          <StatCard 
            title="AI Processed" 
            value={processedEmails} 
            icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
            className="bg-green-50/50 border-green-100"
          />
          <StatCard 
            title="Pending Actions" 
            value={pendingEmails} 
            icon={<AlertCircle className="w-5 h-5 text-orange-500" />}
            className="bg-orange-50/50 border-orange-100"
          />
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-4 overflow-x-auto no-scrollbar">
            <FilterButton 
              active={filter === "all"} 
              onClick={() => setFilter("all")}
              label="All Emails"
            />
            <FilterButton 
              active={filter === "pending"} 
              onClick={() => setFilter("pending")}
              label="Pending"
            />
            <div className="w-px h-6 bg-border mx-2" />
            {categories.map((cat) => (
              <FilterButton
                key={cat}
                active={filter === cat}
                onClick={() => setFilter(cat)}
                label={cat}
              />
            ))}
          </div>

          {/* Email List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 w-full bg-secondary/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
              <p className="text-destructive font-medium">Failed to load emails</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : (
            <EmailList 
              emails={filteredEmails}
              onSummarize={(id) => summarizeMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
              isSummarizingId={summarizeMutation.isPending ? summarizeMutation.variables : null}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner file

function StatCard({ title, value, icon, className }: { title: string, value: number, icon: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-display font-bold text-foreground">
        {value}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
        ${active 
          ? "bg-foreground text-background shadow-md" 
          : "bg-background border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
        }
      `}
    >
      {label}
    </button>
  );
}
