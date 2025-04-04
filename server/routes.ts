import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/stats/sales", async (req, res) => {
    try {
      const salesStats = await storage.getSalesStats();
      res.json(salesStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales statistics" });
    }
  });

  app.get("/api/stats/users", async (req, res) => {
    try {
      const userStats = await storage.getUserStats();
      res.json(userStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user statistics" });
    }
  });

  app.get("/api/stats/products", async (req, res) => {
    try {
      const productStats = await storage.getProductStats();
      res.json(productStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product statistics" });
    }
  });

  app.get("/api/stats/transactions", async (req, res) => {
    try {
      const transactionStats = await storage.getTransactionStats();
      res.json(transactionStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction statistics" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
