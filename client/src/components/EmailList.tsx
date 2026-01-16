import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { type Email } from "@shared/schema";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Wand2, Trash2, Mail, FileText, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EmailListProps {
  emails: Email[];
  onSummarize: (id: number) => void;
  onDelete: (id: number) => void;
  isSummarizingId: number | null;
}

export function EmailList({ emails, onSummarize, onDelete, isSummarizingId }: EmailListProps) {
  // Simple state to track expanded items for mobile/tablet view details
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-primary/5 p-4 rounded-full mb-4">
          <Mail className="w-10 h-10 text-primary/40" />
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground">Inbox Zero</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          No emails to process. Run the workflow to simulate incoming messages.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <AnimatePresence mode="popLayout">
        {emails.map((email) => (
          <motion.div
            key={email.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={cn(
              "overflow-hidden border-border/50 hover:shadow-md transition-shadow duration-300",
              email.isProcessed ? "bg-card" : "bg-card shadow-sm border-l-4 border-l-primary"
            )}>
              <div className="p-4 sm:p-6 grid gap-4 grid-cols-1 md:grid-cols-[2fr_3fr_auto] items-start">
                
                {/* Column 1: Sender & Subject */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm truncate">
                      {email.sender}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      • {format(new Date(email.createdAt || new Date()), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <h4 className="font-display font-medium text-lg text-foreground leading-tight">
                    {email.subject}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 md:hidden">
                    {email.body}
                  </p>
                  
                  {/* Mobile Actions */}
                  <div className="flex md:hidden gap-2 mt-3">
                    <StatusBadge category={email.category} isProcessed={email.isProcessed || false} />
                  </div>
                </div>

                {/* Column 2: Summary/Content */}
                <div className="hidden md:block space-y-2">
                  {email.summary ? (
                    <div className="bg-secondary/30 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center gap-1.5 mb-1 text-xs font-medium text-primary">
                        <Wand2 className="w-3 h-3" />
                        <span>AI Summary</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {email.summary}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground line-clamp-3 italic">
                      {email.body}
                    </p>
                  )}
                </div>

                {/* Column 3: Meta & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 h-full">
                  <div className="hidden md:flex">
                    <StatusBadge category={email.category} isProcessed={email.isProcessed || false} />
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    {!email.summary && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        onClick={() => onSummarize(email.id)}
                        disabled={isSummarizingId === email.id}
                      >
                        {isSummarizingId === email.id ? (
                          <span className="animate-pulse">Analyzing...</span>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Summarize
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(email.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Expandable content for mobile summary if present */}
              {email.summary && (
                <div className="md:hidden border-t px-4 py-3 bg-secondary/20">
                  <div className="flex items-center gap-1.5 mb-1 text-xs font-medium text-primary">
                    <Wand2 className="w-3 h-3" />
                    <span>AI Summary</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {email.summary}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
