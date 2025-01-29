// Import types
import type { Tournament, Team, Match, User } from "@/types";

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Utility function for authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

// Service Factory
function createService<T>(basePath: string) {
  return {
    getAll: () => fetchWithAuth(`/${basePath}`),
    getById: (id: string) => fetchWithAuth(`/${basePath}/${id}`),
    create: (data: Partial<T>) =>
      fetchWithAuth(`/${basePath}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<T>) =>
      fetchWithAuth(`/${basePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/${basePath}/${id}`, {
        method: "DELETE",
      }),
  };
}

// Tournament Services
export const tournamentService = {
  ...createService<Tournament>("tournaments"),
};

// Team Services
export const teamService = {
  ...createService<Team>("teams"),
  approve: (id: string) =>
    fetchWithAuth(`/teams/${id}/approve`, {
      method: "POST",
    }),
};

// Match Services
export const matchService = {
  ...createService<Match>("matches"),
  updateResult: (id: string, homeScore: number, awayScore: number) =>
    fetchWithAuth(`/matches/${id}/result`, {
      method: "PUT",
      body: JSON.stringify({ homeScore, awayScore }),
    }),
};

// Rankings Services
export const rankingService = {
  getTeamRankings: (tournamentId?: string) =>
    fetchWithAuth(
      `/rankings/teams${tournamentId ? `?tournamentId=${tournamentId}` : ""}`
    ),
  getPlayerStats: (tournamentId?: string) =>
    fetchWithAuth(
      `/rankings/players${tournamentId ? `?tournamentId=${tournamentId}` : ""}`
    ),
};

// User Services
export const userService = {
  getCurrent: () => fetchWithAuth("/users/me"),
  update: (data: Partial<User>) =>
    fetchWithAuth("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
