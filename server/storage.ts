import { db } from "./db";
import { emails, type Email, type InsertEmail } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getEmails(): Promise<Email[]>;
  getEmail(id: number): Promise<Email | undefined>;
  createEmail(email: InsertEmail): Promise<Email>;
  updateEmail(id: number, updates: Partial<Email>): Promise<Email | undefined>;
  deleteEmail(id: number): Promise<void>;
  countEmails(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getEmails(): Promise<Email[]> {
    return await db.select().from(emails).orderBy(emails.createdAt);
  }

  async getEmail(id: number): Promise<Email | undefined> {
    const [email] = await db.select().from(emails).where(eq(emails.id, id));
    return email;
  }

  async createEmail(insertEmail: InsertEmail): Promise<Email> {
    const [email] = await db.insert(emails).values(insertEmail).returning();
    return email;
  }

  async updateEmail(id: number, updates: Partial<Email>): Promise<Email | undefined> {
    const [email] = await db.update(emails)
      .set(updates)
      .where(eq(emails.id, id))
      .returning();
    return email;
  }

  async deleteEmail(id: number): Promise<void> {
    await db.delete(emails).where(eq(emails.id, id));
  }

  async countEmails(): Promise<number> {
    const result = await db.select({ count: emails.id }).from(emails);
    return result.length;
  }
}

export const storage = new DatabaseStorage();
