"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Team, User } from "@/types"

interface TeamStats extends Team {
  matches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

interface PlayerStats extends User {
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  matches: number
}

export default function RankingsPage() {
  const [teams, ] = useState<TeamStats[]>([])
  const [players, ] = useState<PlayerStats[]>([])
  const [selectedTournament, setSelectedTournament] = useState<string>("all")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rankings</h1>
        <Select value={selectedTournament} onValueChange={setSelectedTournament}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Tournament" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os torneios</SelectItem>
            <SelectItem value="tournament-1">Torneio 1</SelectItem>
            <SelectItem value="tournament-2">Torneio 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams">Classificação da equipe</TabsTrigger>
          <TabsTrigger value="players">Estatísticas do jogador</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Classificação da equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead>P</TableHead>
                    <TableHead>W</TableHead>
                    <TableHead>D</TableHead>
                    <TableHead>L</TableHead>
                    <TableHead>GF</TableHead>
                    <TableHead>GA</TableHead>
                    <TableHead>Pontos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team, index) => (
                    <TableRow key={team.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.matches}</TableCell>
                      <TableCell>{team.wins}</TableCell>
                      <TableCell>{team.draws}</TableCell>
                      <TableCell>{team.losses}</TableCell>
                      <TableCell>{team.goalsFor}</TableCell>
                      <TableCell>{team.goalsAgainst}</TableCell>
                      <TableCell className="font-bold">{team.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas do jogador</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jogador</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead>Partidas</TableHead>
                    <TableHead>Metas</TableHead>
                    <TableHead>Assistências</TableHead>
                    <TableHead>Cartões Amarelos</TableHead>
                    <TableHead>Cartões vermelhos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>Team Name</TableCell>
                      <TableCell>{player.matches}</TableCell>
                      <TableCell>{player.goals}</TableCell>
                      <TableCell>{player.assists}</TableCell>
                      <TableCell>{player.yellowCards}</TableCell>
                      <TableCell>{player.redCards}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

