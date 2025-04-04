import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  transactions, type Transaction, type InsertTransaction,
  type SalesStats, type UserStats, type ProductStats, type TransactionStats
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { IStorage } from "./storage";

// Database implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  
  async updateProductStock(id: number, stock: number): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ stock })
      .where(eq(products.id, id))
      .returning();
    return product;
  }
  
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }
  
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions);
  }
  
  // Dashboard statistics
  async getSalesStats(): Promise<SalesStats> {
    // Get all successful transactions
    const successfulTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.status, 'success'));
    
    const totalTransactions = successfulTransactions.length;
    
    // Calculate total revenue (sum of selling_price)
    const totalRevenue = successfulTransactions.reduce(
      (sum: number, transaction: Transaction) => sum + transaction.sellingPrice,
      0
    );
    
    // Calculate total profit (sum of selling_price - price)
    const totalProfit = successfulTransactions.reduce(
      (sum: number, transaction: Transaction) => sum + (transaction.sellingPrice - transaction.price),
      0
    );
    
    return {
      totalTransactions,
      totalRevenue,
      totalProfit
    };
  }
  
  async getUserStats(): Promise<UserStats> {
    // Get all active users
    const activeUsers = await db
      .select()
      .from(users)
      .where(eq(users.isActive, true));
    
    const totalActiveUsers = activeUsers.length;
    
    // Calculate average balance of active users
    const averageBalance = totalActiveUsers > 0
      ? activeUsers.reduce((sum: number, user: User) => sum + user.balance, 0) / totalActiveUsers
      : 0;
    
    return {
      totalActiveUsers,
      averageBalance
    };
  }
  
  async getProductStats(): Promise<ProductStats> {
    // Get all products and transactions
    const allProducts = await db.select().from(products);
    const successfulTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.status, 'success'));
    
    // Create a map for quick product lookups by buyerSkuCode
    const productMap = new Map<string, Product>();
    allProducts.forEach((product: Product) => productMap.set(product.buyerSkuCode, product));
    
    // Calculate product sales by buyerSkuCode
    const productSales = new Map<string, number>();
    successfulTransactions.forEach((transaction: Transaction) => {
      const currentSales = productSales.get(transaction.buyerSkuCode) || 0;
      productSales.set(transaction.buyerSkuCode, currentSales + 1);
    });
    
    // Best selling products (top 4)
    const bestSelling = Array.from(productSales.entries())
      .map(([buyerSkuCode, soldQuantity]) => ({
        product: productMap.get(buyerSkuCode)!,
        soldQuantity
      }))
      .filter(item => item.product) // Filter out undefined products
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 4);
    
    // Calculate product profits
    const productProfits = new Map<string, { totalSales: number; totalProfit: number }>();
    
    successfulTransactions.forEach((transaction: Transaction) => {
      const current = productProfits.get(transaction.buyerSkuCode) || { totalSales: 0, totalProfit: 0 };
      const profit = transaction.sellingPrice - transaction.price;
      
      productProfits.set(transaction.buyerSkuCode, {
        totalSales: current.totalSales + 1,
        totalProfit: current.totalProfit + profit
      });
    });
    
    // Most profitable products (top 5)
    const mostProfitable = Array.from(productProfits.entries())
      .map(([buyerSkuCode, { totalSales, totalProfit }]) => {
        const product = productMap.get(buyerSkuCode);
        if (!product) return null;
        
        const profitMargin = ((product.sellingPrice - product.price) / product.sellingPrice) * 100;
        
        return {
          product,
          profitMargin,
          totalSales,
          totalProfit
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 5);
      
    // Low stock products (stock <= 15)
    const lowStock = allProducts
      .filter(product => product.stock !== null && product.stock <= 15)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
      .slice(0, 4);
    
    return {
      bestSelling,
      mostProfitable,
      lowStock
    };
  }
  
  async getTransactionStats(): Promise<TransactionStats> {
    // Get all successful transactions and products
    const successfulTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.status, 'success'));
    
    const allProducts = await db.select().from(products);
    
    // Create a map for quick product lookups by buyerSkuCode
    const productMap = new Map<string, Product>();
    allProducts.forEach((product: Product) => productMap.set(product.buyerSkuCode, product));
    
    // Group transactions by day for the last 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyCounts: { [date: string]: number } = {};
    
    // Initialize with the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyCounts[dateStr] = 0;
    }
    
    // Calculate daily transactions
    for (const transaction of successfulTransactions) {
      if (!transaction.createdAt) continue;
      
      const date = new Date(transaction.createdAt);
      const dateStr = date.toISOString().split('T')[0];
      
      if (dailyCounts[dateStr] !== undefined) {
        dailyCounts[dateStr] += 1;
      }
    }
    
    const dailyTransactions = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }));
    
    // Calculate category distribution
    const categoryMap = new Map<string, number>();
    
    for (const transaction of successfulTransactions) {
      const product = productMap.get(transaction.buyerSkuCode);
      if (!product) continue;
      
      const category = product.category;
      const currentCount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentCount + 1);
    }
    
    const categoryDistribution = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    
    return {
      dailyTransactions,
      categoryDistribution
    };
  }
}