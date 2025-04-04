import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  balance: doublePrecision("balance").notNull().default(0),
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(), // cost price
  sellingPrice: doublePrecision("selling_price").notNull(),
  stock: integer("stock").notNull().default(0),
});

// Transaction model
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  status: text("status").notNull().default("pending"), // pending, success, failed
  price: doublePrecision("price").notNull(), // original cost price
  sellingPrice: doublePrecision("selling_price").notNull(),
  date: text("date").notNull(), // ISO date string
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isActive: true,
  balance: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  sellingPrice: true,
  stock: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  productId: true,
  quantity: true,
  status: true,
  price: true,
  sellingPrice: true,
  date: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

// Dashboard statistics types
export type SalesStats = {
  totalTransactions: number;
  totalRevenue: number;
  totalProfit: number;
};

export type UserStats = {
  totalActiveUsers: number;
  averageBalance: number;
};

export type ProductStats = {
  bestSelling: Array<{
    product: Product;
    soldQuantity: number;
  }>;
  mostProfitable: Array<{
    product: Product;
    profitMargin: number;
    totalSales: number;
    totalProfit: number;
  }>;
  lowStock: Array<Product>;
};

export type TransactionStats = {
  dailyTransactions: Array<{
    date: string;
    count: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
};
