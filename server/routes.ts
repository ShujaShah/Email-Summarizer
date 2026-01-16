import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const MOCK_EMAILS = [
  {
    sender: "alice@example.com",
    subject: "Project Kickoff Meeting",
    body: "Hi team, let's meet on Monday at 10 AM to discuss the new roadmap. Please review the attached docs beforehand.",
  },
  {
    sender: "billing@saas-service.com",
    subject: "Invoice #12345",
    body: "Dear Customer, your invoice for the month of January is ready. Total amount: $49.99. Due date: Jan 31st.",
  },
  {
    sender: "support@tool.io",
    subject: "Re: Login Issue",
    body: "Hello, thanks for reaching out. Have you tried resetting your password using the 'Forgot Password' link? Let us know if that helps.",
  },
  {
    sender: "newsletter@techly.com",
    subject: "Weekly Tech Roundup",
    body: "This week in tech: AI takes over email summarization! Read more about the latest trends in LLMs and automation.",
  },
];

async function summarizeEmail(body: string, subject: string) {
  try {
    const prompt = `
      You are an helpful assistant that summarizes emails.
      Subject: ${subject}
      Body: ${body}
      
      Please provide:
      1. A concise 2-3 sentence summary.
      2. A category for this email (e.g., 'Meeting', 'Invoice', 'Support Request', 'Newsletter', 'General').
      
      Return the result as a JSON object with keys "summary" and "category".
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content)
      return {
        summary: "Failed to generate summary.",
        category: "Uncategorized",
      };

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI Error:", error);
    return { summary: "Error generating summary.", category: "Error" };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get(api.emails.list.path, async (req, res) => {
    const emails = await storage.getEmails();
    res.json(emails);
  });

  app.post(api.emails.create.path, async (req, res) => {
    try {
      const input = api.emails.create.input.parse(req.body);
      const email = await storage.createEmail(input);
      res.status(201).json(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.get(api.emails.get.path, async (req, res) => {
    const email = await storage.getEmail(Number(req.params.id));
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.json(email);
  });

  app.delete(api.emails.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    const email = await storage.getEmail(id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    await storage.deleteEmail(id);
    res.status(204).send();
  });

  app.post(api.emails.summarize.path, async (req, res) => {
    const id = Number(req.params.id);
    const email = await storage.getEmail(id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const { summary, category } = await summarizeEmail(
      email.body,
      email.subject,
    );

    const updatedEmail = await storage.updateEmail(id, {
      summary,
      category,
      isProcessed: true,
    });

    res.json(updatedEmail);
  });

  app.post(api.workflow.run.path, async (req, res) => {
    // 1. Seed if empty
    const count = await storage.countEmails();
    if (count === 0) {
      for (const mock of MOCK_EMAILS) {
        await storage.createEmail(mock);
      }
    }

    // 2. Fetch all unprocessed emails
    // (In a real app, we might limit this batch size)
    const allEmails = await storage.getEmails();
    const unprocessed = allEmails.filter((e) => !e.isProcessed);

    // 3. Process them
    let processedCount = 0;
    for (const email of unprocessed) {
      const { summary, category } = await summarizeEmail(
        email.body,
        email.subject,
      );
      await storage.updateEmail(email.id, {
        summary,
        category,
        isProcessed: true,
      });
      processedCount++;
    }

    res.json({ message: "Workflow completed", count: processedCount });
  });

  return httpServer;
}
