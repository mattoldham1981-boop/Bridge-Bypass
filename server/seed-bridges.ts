import { storage } from "./storage";

const SEED_BRIDGES = [
  { name: "Holland Tunnel Approach", latitude: 40.7128, longitude: -74.0060, clearanceHeight: "12' 8\"", clearanceInches: 152, state: "NY", city: "New York", roadName: "Canal Street" },
  { name: "Times Square Underpass", latitude: 40.7589, longitude: -73.9851, clearanceHeight: "11' 6\"", clearanceInches: 138, state: "NY", city: "New York", roadName: "Broadway" },
  { name: "Riverside Drive Bridge", latitude: 40.8075, longitude: -73.9626, clearanceHeight: "12' 0\"", clearanceInches: 144, state: "NY", city: "New York", roadName: "Riverside Dr" },
  { name: "Atlantic Ave Overpass", latitude: 40.6782, longitude: -73.9442, clearanceHeight: "12' 4\"", clearanceInches: 148, state: "NY", city: "Brooklyn", roadName: "Atlantic Ave" },
  { name: "Brooklyn Battery Tunnel", latitude: 40.6940, longitude: -74.0134, clearanceHeight: "12' 1\"", clearanceInches: 145, state: "NY", city: "Brooklyn", roadName: "FDR Drive" },
  { name: "Queens-Midtown Tunnel", latitude: 40.7433, longitude: -73.9677, clearanceHeight: "12' 8\"", clearanceInches: 152, state: "NY", city: "Queens", roadName: "I-495" },
  { name: "Lincoln Tunnel", latitude: 40.7614, longitude: -74.0055, clearanceHeight: "13' 0\"", clearanceInches: 156, state: "NY", city: "New York", roadName: "NJ-495" },
  { name: "FDR Drive Underpass", latitude: 40.7489, longitude: -73.9680, clearanceHeight: "11' 8\"", clearanceInches: 140, state: "NY", city: "New York", roadName: "FDR Drive" },
];

export async function seedBridges() {
  console.log("Seeding bridge data...");
  
  try {
    const existingBridges = await storage.getBridges();
    
    if (existingBridges.length > 0) {
      console.log(`Database already has ${existingBridges.length} bridges. Skipping seed.`);
      return;
    }
    
    for (const bridge of SEED_BRIDGES) {
      await storage.createBridge(bridge);
    }
    
    console.log(`Successfully seeded ${SEED_BRIDGES.length} bridges!`);
  } catch (error) {
    console.error("Error seeding bridges:", error);
  }
}
