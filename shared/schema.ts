import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const bridges = pgTable("bridges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  clearanceHeight: text("clearance_height").notNull(),
  clearanceInches: integer("clearance_inches").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  roadName: text("road_name").notNull(),
});

export const vehicleProfiles = pgTable("vehicle_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default('demo-user'),
  name: text("name").notNull(),
  height: text("height").notNull(),
  heightInches: integer("height_inches").notNull(),
  weight: text("weight").notNull(),
  length: text("length").notNull(),
  width: text("width").notNull(),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default('demo-user'),
  vehicleProfileId: integer("vehicle_profile_id").notNull(),
  startLat: real("start_lat").notNull(),
  startLng: real("start_lng").notNull(),
  endLat: real("end_lat").notNull(),
  endLng: real("end_lng").notNull(),
  routeData: text("route_data").notNull(),
  avoidedBridges: text("avoided_bridges").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertBridgeSchema = createInsertSchema(bridges).omit({ id: true });
export const insertVehicleProfileSchema = createInsertSchema(vehicleProfiles).omit({ id: true, userId: true });
export const insertRouteSchema = createInsertSchema(routes).omit({ id: true, userId: true });

export type Bridge = typeof bridges.$inferSelect;
export type InsertBridge = z.infer<typeof insertBridgeSchema>;

export type VehicleProfile = typeof vehicleProfiles.$inferSelect;
export type InsertVehicleProfile = z.infer<typeof insertVehicleProfileSchema>;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
