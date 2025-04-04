import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
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
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const clients = new Set<WebSocket>();

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    // Add the new client to our set
    clients.add(ws);
    
    console.log('WebSocket client connected, total clients:', clients.size);
    
    // Send initial data to the client
    sendDashboardData(ws);
    
    // Handle disconnections
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected, remaining clients:', clients.size);
    });
    
    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === 'getDashboardData') {
          sendDashboardData(ws);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
  });
  
  // Function to send dashboard data to a client
  async function sendDashboardData(client: WebSocket) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        // Gather all the dashboard data
        const [salesStats, userStats, productStats, transactionStats] = await Promise.all([
          storage.getSalesStats(),
          storage.getUserStats(),
          storage.getProductStats(),
          storage.getTransactionStats()
        ]);
        
        // Send the data to the client
        client.send(JSON.stringify({
          type: 'dashboardData',
          data: {
            salesStats,
            userStats,
            productStats,
            transactionStats
          }
        }));
      } catch (error) {
        console.error('Error sending dashboard data:', error);
      }
    }
  }
  
  // Function to broadcast data to all connected clients
  function broadcastDashboardData() {
    clients.forEach(client => {
      sendDashboardData(client);
    });
  }
  
  // Set up interval to broadcast updated data to all clients every 30 seconds
  setInterval(broadcastDashboardData, 30000);

  return httpServer;
}
