import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  transactions, type Transaction, type InsertTransaction,
  type SalesStats, type UserStats, type ProductStats, type TransactionStats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, stock: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(): Promise<Transaction[]>;
  
  // Dashboard statistics
  getSalesStats(): Promise<SalesStats>;
  getUserStats(): Promise<UserStats>;
  getProductStats(): Promise<ProductStats>;
  getTransactionStats(): Promise<TransactionStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private transactions: Map<number, Transaction>;
  private userCurrentId: number;
  private productCurrentId: number;
  private transactionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.transactions = new Map();
    this.userCurrentId = 1;
    this.productCurrentId = 1;
    this.transactionCurrentId = 1;
    
    // Add some sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Sample users
    const sampleUsers: InsertUser[] = [
      { username: "john_doe", password: "password", isActive: true, balance: 5000000 },
      { username: "jane_smith", password: "password", isActive: true, balance: 3500000 },
      { username: "mike_johnson", password: "password", isActive: true, balance: 2000000 },
      { username: "sarah_williams", password: "password", isActive: false, balance: 1500000 },
      { username: "david_brown", password: "password", isActive: true, balance: 4500000 }
    ];
    
    sampleUsers.forEach(user => {
      this.createUser(user);
    });
    
    // Sample products
    const sampleProducts: InsertProduct[] = [
      { name: "Smartphone X Pro", description: "Latest flagship smartphone", category: "Mobile", price: 7500000, sellingPrice: 12999000, stock: 45 },
      { name: "Wireless Earbuds", description: "Premium wireless earbuds", category: "Audio", price: 1500000, sellingPrice: 3899000, stock: 75 },
      { name: "Smart Watch Series 5", description: "Advanced smartwatch", category: "Wearables", price: 2000000, sellingPrice: 4500000, stock: 30 },
      { name: "Bluetooth Speaker", description: "Portable speaker with HD sound", category: "Audio", price: 800000, sellingPrice: 1899000, stock: 60 },
      { name: "Premium Laptop Pro", description: "High-performance laptop", category: "Electronics", price: 10000000, sellingPrice: 15499000, stock: 25 },
      { name: "Wireless Noise-Cancelling Headphones", description: "Premium headphones", category: "Audio", price: 2250000, sellingPrice: 3899000, stock: 40 },
      { name: "Ultra HD Smart TV 55\"", description: "4K Smart TV", category: "Electronics", price: 5300000, sellingPrice: 8299000, stock: 20 },
      { name: "Premium Coffee Machine", description: "Professional coffee maker", category: "Home Appliances", price: 3800000, sellingPrice: 6499000, stock: 15 },
      { name: "Ultra HD Monitor 27\"", description: "4K Monitor", category: "Electronics", price: 3500000, sellingPrice: 5899000, stock: 3 },
      { name: "Gaming Keyboard RGB", description: "Mechanical gaming keyboard", category: "Gaming", price: 800000, sellingPrice: 1499000, stock: 5 },
      { name: "Bluetooth Headphones", description: "Wireless headphones", category: "Audio", price: 600000, sellingPrice: 1299000, stock: 12 },
      { name: "External SSD 1TB", description: "Fast external storage", category: "Storage", price: 1200000, sellingPrice: 1899000, stock: 15 }
    ];
    
    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
    
    // Sample transactions
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const createSampleTransaction = (
      userId: number, 
      productId: number, 
      quantity: number, 
      daysAgo: number, 
      status: string = "success"
    ) => {
      const product = this.products.get(productId);
      if (!product) return;
      
      const date = new Date(today.getTime() - (oneDay * daysAgo));
      
      const transaction: InsertTransaction = {
        userId,
        productId,
        quantity,
        status,
        price: product.price,
        sellingPrice: product.sellingPrice,
        date: date.toISOString()
      };
      
      this.createTransaction(transaction);
    };
    
    // Create about 200 transactions spread over last 7 days
    for (let i = 0; i < 200; i++) {
      const userId = Math.floor(Math.random() * 5) + 1;
      const productId = Math.floor(Math.random() * 12) + 1;
      const quantity = Math.floor(Math.random() * 3) + 1;
      const daysAgo = Math.floor(Math.random() * 7);
      const status = Math.random() > 0.1 ? "success" : "failed"; // 10% failure rate
      
      createSampleTransaction(userId, productId, quantity, daysAgo, status);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  async updateProductStock(id: number, stock: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, stock };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
  
  // Dashboard statistics
  async getSalesStats(): Promise<SalesStats> {
    const transactions = Array.from(this.transactions.values());
    const successfulTransactions = transactions.filter(t => t.status === "success");
    
    const totalTransactions = successfulTransactions.length;
    
    // Calculate total revenue (sum of selling_price for successful transactions)
    const totalRevenue = successfulTransactions.reduce(
      (sum, transaction) => sum + (transaction.sellingPrice * transaction.quantity),
      0
    );
    
    // Calculate total profit (sum of selling_price - price for successful transactions)
    const totalProfit = successfulTransactions.reduce(
      (sum, transaction) => sum + ((transaction.sellingPrice - transaction.price) * transaction.quantity),
      0
    );
    
    return {
      totalTransactions,
      totalRevenue,
      totalProfit
    };
  }
  
  async getUserStats(): Promise<UserStats> {
    const users = Array.from(this.users.values());
    const activeUsers = users.filter(user => user.isActive);
    
    const totalActiveUsers = activeUsers.length;
    
    // Calculate average balance of active users
    const averageBalance = totalActiveUsers > 0
      ? activeUsers.reduce((sum, user) => sum + user.balance, 0) / totalActiveUsers
      : 0;
    
    return {
      totalActiveUsers,
      averageBalance
    };
  }
  
  async getProductStats(): Promise<ProductStats> {
    const products = Array.from(this.products.values());
    const transactions = Array.from(this.transactions.values())
      .filter(t => t.status === "success");
      
    // Calculate product sales quantities
    const productSales = new Map<number, number>();
    transactions.forEach(transaction => {
      const currentSales = productSales.get(transaction.productId) || 0;
      productSales.set(transaction.productId, currentSales + transaction.quantity);
    });
    
    // Best selling products (top 4)
    const productSalesList = Array.from(productSales.entries())
      .map(([productId, soldQuantity]) => ({
        product: products.find(p => p.id === productId)!,
        soldQuantity
      }))
      .filter(item => item.product) // Filter out any undefined products
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 4);
      
    // Most profitable products (top 5)
    const productProfits = new Map<number, { totalSales: number; totalProfit: number }>();
    
    transactions.forEach(transaction => {
      const current = productProfits.get(transaction.productId) || { totalSales: 0, totalProfit: 0 };
      const profit = (transaction.sellingPrice - transaction.price) * transaction.quantity;
      
      productProfits.set(transaction.productId, {
        totalSales: current.totalSales + transaction.quantity,
        totalProfit: current.totalProfit + profit
      });
    });
    
    const mostProfitableProducts = Array.from(productProfits.entries())
      .map(([productId, { totalSales, totalProfit }]) => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;
        
        const profitMargin = ((product.sellingPrice - product.price) / product.sellingPrice) * 100;
        
        return {
          product,
          profitMargin,
          totalSales,
          totalProfit
        };
      })
      .filter(item => item !== null) // Filter out any null items
      .sort((a, b) => (b?.totalProfit || 0) - (a?.totalProfit || 0))
      .slice(0, 5);
      
    // Low stock products (stock <= 15)
    const lowStockProducts = products
      .filter(product => product.stock <= 15)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 4);
      
    return {
      bestSelling: productSalesList,
      mostProfitable: mostProfitableProducts as any,
      lowStock: lowStockProducts
    };
  }
  
  async getTransactionStats(): Promise<TransactionStats> {
    const transactions = Array.from(this.transactions.values())
      .filter(t => t.status === "success");
    
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
    
    // Count transactions per day
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateStr = date.toISOString().split('T')[0];
      
      if (dailyCounts[dateStr] !== undefined) {
        dailyCounts[dateStr] += 1;
      }
    });
    
    const dailyTransactions = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
    
    // Category distribution
    const categoryMap = new Map<string, number>();
    
    for (const transaction of transactions) {
      const product = this.products.get(transaction.productId);
      if (!product) continue;
      
      const category = product.category;
      const currentCount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentCount + transaction.quantity);
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

export const storage = new MemStorage();
