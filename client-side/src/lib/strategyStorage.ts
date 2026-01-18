import apiClient, { resOk } from "./apiClient";
import type { OptionLeg } from "./options";

export interface SavedStrategy {
  id: string;
  name: string;
  legs: OptionLeg[];
  // createdAt: string;
  // updatedAt: string;
}

// ===========================================
// API Functions - Connect to your Flask backend
// ===========================================

export async function saveStrategy(name: string, legs: OptionLeg[]): Promise<SavedStrategy> {
  // const strategy: SavedStrategy = {
  //   name,
  //   legs,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // };
  
    // TODO: Replace with your Flask API call

    const response = await apiClient.post(
      "/strategies",
      {
        name: name,
        legs: legs,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (!resOk(response.status)) {
      throw new Error("Unable to save strategy");
    }

    const savedStrategy: SavedStrategy = response.data;

    console.log(JSON.stringify(savedStrategy));

    return savedStrategy;

    // const response = await fetch(`${API_BASE_URL}/strategies`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, legs }),
    // });
    // return response.json();

  // // Fallback: localStorage for development
  // const strategies = getStrategiesFromStorage();
  // strategies.push(strategy);
  // localStorage.setItem("savedStrategies", JSON.stringify(strategies));
  // return strategy;
}

export async function loadStrategies(): Promise<SavedStrategy[]> {
  // TODO: Replace with your Flask API call
  // const response = await fetch(`${API_BASE_URL}/strategies`);
  // return response.json();

  const response = await apiClient.get("/strategies");

  if (!resOk(response.status)) {
    throw new Error("Unable to load saved strategies");
  }

  const savedStrategies: SavedStrategy[] = response.data;

  console.log(JSON.stringify(savedStrategies));

  return savedStrategies;
}

export async function deleteStrategy(id: string): Promise<void> {
  // TODO: Replace with your Flask API call
  // await fetch(`${API_BASE_URL}/strategies/${id}`, { method: "DELETE" });
  // return;


  // Fallback: localStorage for development
  const strategies = getStrategiesFromStorage();
  const filtered = strategies.filter((s) => s.id !== id);
  localStorage.setItem("savedStrategies", JSON.stringify(filtered));
}

export async function updateStrategy(id: string, name: string, legs: OptionLeg[]): Promise<SavedStrategy> {
  // TODO: Replace with your Flask API call
  // const response = await fetch(`${API_BASE_URL}/strategies/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ name, legs }),
  // });
  // return response.json();


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
