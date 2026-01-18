import type { OptionLeg } from "./options";

export interface SavedStrategy {
  id: string;
  name: string;
  legs: OptionLeg[];
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// BACKEND API CONFIGURATION
// Replace these with your Flask backend URLs
// ===========================================
const API_BASE_URL = ""; // e.g., "http://localhost:5000/api"

// ===========================================
// API Functions - Connect to your Flask backend
// ===========================================

export async function saveStrategy(name: string, legs: OptionLeg[]): Promise<SavedStrategy> {
  const strategy: SavedStrategy = {
    id: crypto.randomUUID(), //todo: make backend generate this not the client
    name,
    legs,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (API_BASE_URL) {
    // TODO: Replace with your Flask API call
    // const response = await fetch(`${API_BASE_URL}/strategies`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, legs }),
    // });
    // return response.json();
  }

  // Fallback: localStorage for development
  const strategies = getStrategiesFromStorage();
  strategies.push(strategy);
  localStorage.setItem("savedStrategies", JSON.stringify(strategies));
  return strategy;
}

export async function loadStrategies(): Promise<SavedStrategy[]> {
  if (API_BASE_URL) {
    // TODO: Replace with your Flask API call
    // const response = await fetch(`${API_BASE_URL}/strategies`);
    // return response.json();
  }

  // Fallback: localStorage for development
  return getStrategiesFromStorage();
}

export async function deleteStrategy(id: string): Promise<void> {
  if (API_BASE_URL) {
    // TODO: Replace with your Flask API call
    // await fetch(`${API_BASE_URL}/strategies/${id}`, { method: "DELETE" });
    // return;
  }

  // Fallback: localStorage for development
  const strategies = getStrategiesFromStorage();
  const filtered = strategies.filter((s) => s.id !== id);
  localStorage.setItem("savedStrategies", JSON.stringify(filtered));
}

export async function updateStrategy(id: string, name: string, legs: OptionLeg[]): Promise<SavedStrategy> {
  if (API_BASE_URL) {
    // TODO: Replace with your Flask API call
    // const response = await fetch(`${API_BASE_URL}/strategies/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, legs }),
    // });
    // return response.json();
  }

  // Fallback: localStorage for development
  const strategies = getStrategiesFromStorage();
  const index = strategies.findIndex((s) => s.id === id);
  if (index !== -1) {
    strategies[index] = {
      ...strategies[index],
      name,
      legs,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("savedStrategies", JSON.stringify(strategies));
    return strategies[index];
  }
  throw new Error("Strategy not found");
}

// Helper function for localStorage fallback
function getStrategiesFromStorage(): SavedStrategy[] {
  try {
    const stored = localStorage.getItem("savedStrategies");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
