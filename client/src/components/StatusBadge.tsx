import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  category?: string | null;
  isProcessed: boolean;
  className?: string;
}

export function StatusBadge({ category, isProcessed, className }: StatusBadgeProps) {
  if (!isProcessed) {
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800",
        className
      )}>
        Pending
      </span>
    );
  }

  // Define colors for known categories
  const getCategoryStyles = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'meeting':
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 'invoice':
      case 'billing':
        return "bg-green-100 text-green-800 border-green-200";
      case 'urgent':
        return "bg-red-100 text-red-800 border-red-200";
      case 'newsletter':
      case 'marketing':
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
      getCategoryStyles(category || ""),
      className
    )}>
      {category || "Uncategorized"}
    </span>
  );
}
