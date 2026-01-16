import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useEmails() {
  return useQuery({
    queryKey: [api.emails.list.path],
    queryFn: async () => {
      const res = await fetch(api.emails.list.path);
      if (!res.ok) throw new Error("Failed to fetch emails");
      return api.emails.list.responses[200].parse(await res.json());
    },
  });
}

export function useSummarizeEmail() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.emails.summarize.path, { id });
      const res = await fetch(url, { method: api.emails.summarize.method });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Email not found");
        throw new Error("Failed to generate summary");
      }
      return api.emails.summarize.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.emails.list.path] });
      toast({
        title: "Summary Generated",
        description: `Successfully summarized email from ${data.sender}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Summarization Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteEmail() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.emails.delete.path, { id });
      const res = await fetch(url, { method: api.emails.delete.method });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Email not found");
        throw new Error("Failed to delete email");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.emails.list.path] });
      toast({
        title: "Email Deleted",
        description: "The email has been removed from your inbox.",
      });
    },
  });
}

export function useRunWorkflow() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.workflow.run.path, { method: api.workflow.run.method });
      if (!res.ok) throw new Error("Failed to run workflow");
      return api.workflow.run.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.emails.list.path] });
      toast({
        title: "Workflow Complete",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Workflow Failed",
        description: "Could not simulate incoming emails.",
        variant: "destructive",
      });
    },
  });
}
