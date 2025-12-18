import { 
  type User, 
  type InsertUser, 
  type Bridge,
  type InsertBridge,
  type VehicleProfile,
  type InsertVehicleProfile,
  type Route,
  type InsertRoute,
  users,
  bridges,
  vehicleProfiles,
  routes
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBridges(): Promise<Bridge[]>;
  getBridgesInBounds(minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<Bridge[]>;
  getBridgesBelowClearance(clearanceInches: number): Promise<Bridge[]>;
  createBridge(bridge: InsertBridge): Promise<Bridge>;
  
  getVehicleProfile(id: number): Promise<VehicleProfile | undefined>;
  getVehicleProfiles(userId: string): Promise<VehicleProfile[]>;
  createVehicleProfile(profile: InsertVehicleProfile, userId: string): Promise<VehicleProfile>;
  updateVehicleProfile(id: number, profile: Partial<InsertVehicleProfile>): Promise<VehicleProfile>;
  
  getRoute(id: number): Promise<Route | undefined>;
  getRoutes(userId: string): Promise<Route[]>;
  createRoute(route: InsertRoute, userId: string): Promise<Route>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getBridges(): Promise<Bridge[]> {
    return await db.select().from(bridges);
  }
  
  async getBridgesInBounds(minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<Bridge[]> {
    return await db.select().from(bridges).where(
      sql`${bridges.latitude} >= ${minLat} AND ${bridges.latitude} <= ${maxLat} AND ${bridges.longitude} >= ${minLng} AND ${bridges.longitude} <= ${maxLng}`
    );
  }
  
  async getBridgesBelowClearance(clearanceInches: number): Promise<Bridge[]> {
    return await db.select().from(bridges).where(
      sql`${bridges.clearanceInches} <= ${clearanceInches}`
    );
  }
  
  async createBridge(bridge: InsertBridge): Promise<Bridge> {
    const [newBridge] = await db
      .insert(bridges)
      .values(bridge)
      .returning();
    return newBridge;
  }
  
  async getVehicleProfile(id: number): Promise<VehicleProfile | undefined> {
    const [profile] = await db.select().from(vehicleProfiles).where(eq(vehicleProfiles.id, id));
    return profile || undefined;
  }
  
  async getVehicleProfiles(userId: string): Promise<VehicleProfile[]> {
    return await db.select().from(vehicleProfiles).where(eq(vehicleProfiles.userId, userId));
  }
  
  async createVehicleProfile(profile: InsertVehicleProfile, userId: string): Promise<VehicleProfile> {
    const [newProfile] = await db
      .insert(vehicleProfiles)
      .values({ ...profile, userId })
      .returning();
    return newProfile;
  }
  
  async updateVehicleProfile(id: number, profile: Partial<InsertVehicleProfile>): Promise<VehicleProfile> {
    const [updatedProfile] = await db
      .update(vehicleProfiles)
      .set(profile)
      .where(eq(vehicleProfiles.id, id))
      .returning();
    return updatedProfile;
  }
  
  async getRoute(id: number): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route || undefined;
  }
  
  async getRoutes(userId: string): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.userId, userId));
  }
  
  async createRoute(route: InsertRoute, userId: string): Promise<Route> {
    const [newRoute] = await db
      .insert(routes)
      .values({ ...route, userId })
      .returning();
    return newRoute;
  }
}

export const storage = new DatabaseStorage();
