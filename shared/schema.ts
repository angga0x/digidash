import { pgTable, text, serial, integer, boolean, doublePrecision, varchar, timestamp, jsonb, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  apiKey: varchar("api_key", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 10 }).notNull().default('user'),
  balance: doublePrecision("balance").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  buyerSkuCode: varchar("buyer_sku_code", { length: 255 }).notNull().unique(),
  sellerName: varchar("seller_name", { length: 255 }).notNull(),
  name: varchar("product_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 20 }).notNull(),
  brand: varchar("brand", { length: 255 }),
  type: varchar("type", { length: 255 }).notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  sellingPrice: doublePrecision("selling_price").notNull(),
  status: varchar("status", { length: 50 }).notNull().default('active'),
  unlimitedStock: boolean("unlimited_stock").notNull().default(false),
  stock: integer("stock"),
  multi: boolean("multi").notNull().default(false),
  startCutOff: time("start_cut_off"),
  endCutOff: time("end_cut_off"),
  lastSync: timestamp("last_sync").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Transaction model
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  refId: varchar("ref_id", { length: 255 }).notNull().unique(),
  customerNo: varchar("customer_no", { length: 255 }).notNull(),
  buyerSkuCode: varchar("buyer_sku_code", { length: 255 }).notNull().references(() => products.buyerSkuCode),
  price: doublePrecision("price").notNull(),
  sellingPrice: doublePrecision("selling_price").notNull(),
  status: varchar("status", { length: 50 }).notNull().default('pending'),
  message: text("message"),
  rc: varchar("rc", { length: 10 }),
  sn: varchar("sn", { length: 255 }),
  balanceBefore: doublePrecision("balance_before").notNull(),
  balanceAfter: doublePrecision("balance_after").notNull(),
  response: jsonb("response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Balance history model
export const balanceHistories = pgTable("balance_histories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 10 }).notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description").notNull(),
  balanceBefore: doublePrecision("balance_before").notNull(),
  balanceAfter: doublePrecision("balance_after").notNull(),
  referenceId: varchar("reference_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow()
});

// Payments model
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  refId: varchar("ref_id", { length: 255 }).notNull().unique(),
  amount: doublePrecision("amount").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull().default('QRISREALTIME'),
  qrString: text("qr_string"),
  qrLink: varchar("qr_link", { length: 255 }),
  payUrl: varchar("pay_url", { length: 255 }),
  trxId: varchar("trx_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default('pending'),
  response: jsonb("response"),
  expiredAt: timestamp("expired_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Markup settings model
export const markupSettings = pgTable("markup_settings", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 20 }).notNull().unique(),
  markupType: varchar("markup_type", { length: 10 }).notNull().default('percentage'),
  markupValue: doublePrecision("markup_value").notNull(),
  minMarkup: doublePrecision("min_markup").notNull().default(0),
  maxMarkup: doublePrecision("max_markup").notNull().default(0),
  status: varchar("status", { length: 50 }).notNull().default('active'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  apiKey: true,
  role: true,
  balance: true,
  isActive: true
});

export const insertProductSchema = createInsertSchema(products).pick({
  buyerSkuCode: true,
  sellerName: true,
  name: true,
  category: true,
  brand: true,
  type: true,
  description: true,
  price: true,
  sellingPrice: true,
  status: true,
  unlimitedStock: true,
  stock: true,
  multi: true
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  refId: true,
  customerNo: true,
  buyerSkuCode: true,
  price: true,
  sellingPrice: true,
  status: true,
  message: true,
  balanceBefore: true,
  balanceAfter: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type BalanceHistory = typeof balanceHistories.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type MarkupSetting = typeof markupSettings.$inferSelect;

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
