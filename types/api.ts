import type { Tournament, Team, Match, User } from "./index";

// Generic API response structure
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Extended Team interface with ranking details
export interface TeamRanking extends Team {
  position: number;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// Player statistics interface
export interface PlayerStats extends User {
  teamId: string;
  teamName: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

// Extended Tournament interface with related teams and matches
export interface TournamentWithTeams extends Tournament {
  teams: Team[];
  matches: Match[];
}
