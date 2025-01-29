export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  lawyerCode: string;
  createdAt: Date;
}

export interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  rules: string;
  status: "DRAFT" | "ACTIVE" | "FINISHED";
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  captainId: string;
  tournamentId: string;
  approved: boolean;
  players: User[];
  createdAt: Date;
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  date: Date;
  location: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "FINISHED";
}
