import { useState, useEffect, useRef } from "react";
import { SalesStats, UserStats, ProductStats, TransactionStats } from "@shared/schema";

interface DashboardData {
  salesStats: SalesStats;
  userStats: UserStats;
  productStats: ProductStats;
  transactionStats: TransactionStats;
}

interface WebSocketMessage {
  type: string;
  data?: DashboardData;
}

export function useWebSocketData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Function to create a new WebSocket connection
    const connectWebSocket = () => {
      try {
        setLoading(true);
        
        // Determine the WebSocket URL based on the current protocol (ws or wss)
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        // Create the WebSocket connection
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        
        // Set up event handlers for the WebSocket
        ws.onopen = () => {
          console.log("WebSocket connection established");
          // Request dashboard data
          ws.send(JSON.stringify({ type: "getDashboardData" }));
        };
        
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            
            // Handle different message types
            if (message.type === "dashboardData" && message.data) {
              setData(message.data);
              setLoading(false);
              setError(null);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
            setError("Failed to parse data from server");
          }
        };
        
        ws.onerror = (event) => {
          console.error("WebSocket error:", event);
          setError("WebSocket connection error");
        };
        
        ws.onclose = (event) => {
          console.log("WebSocket connection closed:", event.code, event.reason);
          // Attempt to reconnect after a short delay
          if (reconnectTimeoutRef.current === null) {
            reconnectTimeoutRef.current = window.setTimeout(() => {
              reconnectTimeoutRef.current = null;
              if (wsRef.current?.readyState !== WebSocket.OPEN) {
                console.log("Attempting to reconnect WebSocket...");
                connectWebSocket();
              }
            }, 3000); // Try to reconnect after 3 seconds
          }
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        setError("Failed to establish WebSocket connection");
        setLoading(false);
      }
    };

    // Initial connection
    connectWebSocket();
    
    // Clean up function
    return () => {
      // Close the WebSocket connection if it exists
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    loading,
    error,
    data,
    // Method to manually request new data
    refresh: () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "getDashboardData" }));
      }
    }
  };
}