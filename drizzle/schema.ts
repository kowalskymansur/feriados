import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Email subscriptions for holiday notifications
export const emailSubscriptions = mysqlTable("emailSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  states: text("states"), // JSON array of selected states
  cities: text("cities"), // JSON array of selected cities
  notificationType: mysqlEnum("notificationType", [
    "all",
    "national",
    "state",
    "municipal",
    "judiciary",
  ])
    .default("all")
    .notNull(),
  daysBeforeNotification: int("daysBeforeNotification").default(7).notNull(), // Notify X days before
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertEmailSubscription = typeof emailSubscriptions.$inferInsert;

// Notification log to track sent emails
export const notificationLogs = mysqlTable("notificationLogs", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId")
    .notNull()
    .references(() => emailSubscriptions.id),
  holidayDate: varchar("holidayDate", { length: 10 }).notNull(), // YYYY-MM-DD
  holidayName: varchar("holidayName", { length: 255 }).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).default("sent").notNull(),
});

export type NotificationLog = typeof notificationLogs.$inferSelect;
export type InsertNotificationLog = typeof notificationLogs.$inferInsert;