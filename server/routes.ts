import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBridgeSchema, insertVehicleProfileSchema, insertRouteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/bridges", async (req, res) => {
    try {
      const bridges = await storage.getBridges();
      res.json(bridges);
    } catch (error) {
      console.error("Error fetching bridges:", error);
      res.status(500).json({ error: "Failed to fetch bridges" });
    }
  });
  
  app.get("/api/bridges/in-bounds", async (req, res) => {
    try {
      const { minLat, maxLat, minLng, maxLng } = req.query;
      
      if (!minLat || !maxLat || !minLng || !maxLng) {
        return res.status(400).json({ error: "Missing bounds parameters" });
      }
      
      const bridges = await storage.getBridgesInBounds(
        parseFloat(minLat as string),
        parseFloat(maxLat as string),
        parseFloat(minLng as string),
        parseFloat(maxLng as string)
      );
      
      res.json(bridges);
    } catch (error) {
      console.error("Error fetching bridges in bounds:", error);
      res.status(500).json({ error: "Failed to fetch bridges" });
    }
  });
  
  app.get("/api/bridges/below-clearance/:clearanceInches", async (req, res) => {
    try {
      const clearanceInches = parseInt(req.params.clearanceInches);
      const bridges = await storage.getBridgesBelowClearance(clearanceInches);
      res.json(bridges);
    } catch (error) {
      console.error("Error fetching low clearance bridges:", error);
      res.status(500).json({ error: "Failed to fetch bridges" });
    }
  });
  
  app.post("/api/bridges", async (req, res) => {
    try {
      const validatedData = insertBridgeSchema.parse(req.body);
      const bridge = await storage.createBridge(validatedData);
      res.status(201).json(bridge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating bridge:", error);
      res.status(500).json({ error: "Failed to create bridge" });
    }
  });
  
  app.get("/api/vehicle-profiles", async (req, res) => {
    try {
      const userId = 'demo-user';
      const profiles = await storage.getVehicleProfiles(userId);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching vehicle profiles:", error);
      res.status(500).json({ error: "Failed to fetch vehicle profiles" });
    }
  });
  
  app.get("/api/vehicle-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getVehicleProfile(id);
      
      if (!profile) {
        return res.status(404).json({ error: "Vehicle profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching vehicle profile:", error);
      res.status(500).json({ error: "Failed to fetch vehicle profile" });
    }
  });
  
  app.post("/api/vehicle-profiles", async (req, res) => {
    try {
      const validatedData = insertVehicleProfileSchema.parse(req.body);
      const userId = 'demo-user';
      const profile = await storage.createVehicleProfile(validatedData, userId);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating vehicle profile:", error);
      res.status(500).json({ error: "Failed to create vehicle profile" });
    }
  });
  
  app.patch("/api/vehicle-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertVehicleProfileSchema.partial().parse(req.body);
      const profile = await storage.updateVehicleProfile(id, validatedData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating vehicle profile:", error);
      res.status(500).json({ error: "Failed to update vehicle profile" });
    }
  });
  
  app.get("/api/routes", async (req, res) => {
    try {
      const userId = 'demo-user';
      const routes = await storage.getRoutes(userId);
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });
  
  app.post("/api/routes", async (req, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const userId = 'demo-user';
      const route = await storage.createRoute(validatedData, userId);
      res.status(201).json(route);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating route:", error);
      res.status(500).json({ error: "Failed to create route" });
    }
  });

  return httpServer;
}
