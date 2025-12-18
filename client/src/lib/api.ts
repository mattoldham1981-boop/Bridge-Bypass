import type { Bridge, VehicleProfile, Route, InsertVehicleProfile, InsertRoute } from "@shared/schema";

const API_BASE = "/api";

export async function getBridges(): Promise<Bridge[]> {
  const response = await fetch(`${API_BASE}/bridges`);
  if (!response.ok) throw new Error("Failed to fetch bridges");
  return response.json();
}

export async function getBridgesInBounds(minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<Bridge[]> {
  const response = await fetch(`${API_BASE}/bridges/in-bounds?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`);
  if (!response.ok) throw new Error("Failed to fetch bridges in bounds");
  return response.json();
}

export async function getBridgesBelowClearance(clearanceInches: number): Promise<Bridge[]> {
  const response = await fetch(`${API_BASE}/bridges/below-clearance/${clearanceInches}`);
  if (!response.ok) throw new Error("Failed to fetch low clearance bridges");
  return response.json();
}

export async function getVehicleProfiles(): Promise<VehicleProfile[]> {
  const response = await fetch(`${API_BASE}/vehicle-profiles`);
  if (!response.ok) throw new Error("Failed to fetch vehicle profiles");
  return response.json();
}

export async function createVehicleProfile(profile: InsertVehicleProfile): Promise<VehicleProfile> {
  const response = await fetch(`${API_BASE}/vehicle-profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error("Failed to create vehicle profile");
  return response.json();
}

export async function updateVehicleProfile(id: number, profile: Partial<InsertVehicleProfile>): Promise<VehicleProfile> {
  const response = await fetch(`${API_BASE}/vehicle-profiles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error("Failed to update vehicle profile");
  return response.json();
}

export async function getRoutes(): Promise<Route[]> {
  const response = await fetch(`${API_BASE}/routes`);
  if (!response.ok) throw new Error("Failed to fetch routes");
  return response.json();
}

export async function createRoute(route: InsertRoute): Promise<Route> {
  const response = await fetch(`${API_BASE}/routes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(route),
  });
  if (!response.ok) throw new Error("Failed to create route");
  return response.json();
}

export interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string } | null;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  prices: Price[];
}

export async function getProductsWithPrices(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products-with-prices`);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data.data;
}

export async function createCheckoutSession(priceId: string, email: string): Promise<{ url: string }> {
  const response = await fetch(`${API_BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, email }),
  });
  if (!response.ok) throw new Error("Failed to create checkout session");
  return response.json();
}
