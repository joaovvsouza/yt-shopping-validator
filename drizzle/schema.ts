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

export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  youtubeUrl: varchar("youtubeUrl", { length: 255 }).notNull(),
  videoId: varchar("videoId", { length: 64 }).notNull(),
  title: text("title"),
  description: text("description"),
  creator: varchar("creator", { length: 255 }),
  hasRequiredHashtag: int("hasRequiredHashtag").default(0).notNull(),
  requiredHashtag: varchar("requiredHashtag", { length: 100 }).default("#pagamento").notNull(),
  productCount: int("productCount").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("videoId").notNull().references(() => videos.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  price: varchar("price", { length: 50 }),
  imageUrl: text("imageUrl"),
  productUrl: text("productUrl"),
  store: varchar("store", { length: 100 }),
  position: int("position").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const validationReports = mysqlTable("validationReports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  totalVideos: int("totalVideos").notNull(),
  totalProducts: int("totalProducts").notNull(),
  videosWithHashtag: int("videosWithHashtag").notNull(),
  videosWithoutHashtag: int("videosWithoutHashtag").notNull(),
  successCount: int("successCount").notNull(),
  failureCount: int("failureCount").notNull(),
  exportFormat: mysqlEnum("exportFormat", ["csv", "excel"]),
  exportedAt: timestamp("exportedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ValidationReport = typeof validationReports.$inferSelect;
export type InsertValidationReport = typeof validationReports.$inferInsert;