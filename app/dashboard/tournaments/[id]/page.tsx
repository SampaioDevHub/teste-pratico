/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TournamentWithTeams } from "@/types/api"
import { EditTournamentDialog } from "@/components/edit-tournament-dialog"
import { ScheduleMatchDialog } from "@/components/schedule-match-dialog"
import { useAuth } from "@/contexts/auth-context"
import { Loading } from "@/components/loading"
import { Error } from "@/components/error"
import { tournamentService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, EditIcon, TrophyIcon, UsersIcon } from "lucide-react"

export default function TournamentDetailsPage() {
  const { id } = useParams()
  const [tournament, setTournament] = useState<TournamentWithTeams | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const isAdmin = user?.role === "ADMIN"

  const fetchTournament = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await tournamentService.getById(id as string)
      setTournament(response.data)
    } catch (error) {
      setError("Failed to load tournament details")
      console.error("Error fetching tournament:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournament()
  }, [id, fetchTournament]) // Added fetchTournament to dependencies

  const handleEditSuccess = (updatedTournament: TournamentWithTeams) => {
    setTournament(updatedTournament)
    setShowEditDialog(false)
    toast({
      title: "Success",
      description: "Tournament updated successfully",
    })
  }

  const handleScheduleSuccess = () => {
    fetchTournament()
    setShowScheduleDialog(false)
    toast({
      title: "Success",
      description: "Match scheduled successfully",
    })
  }

  if (loading) {
    return <Loading message="Loading tournament details..." />
  }

  if (error) {
    return <Error message={error} onRetry={fetchTournament} />
  }

  if (!tournament) {
    return <Error message="Tournament not found" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tournament.name}</h1>
          <p className="text-gray-500">
            {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
          </p>
        </div>
        {isAdmin && (
          <div className="space-x-2">
            <Button onClick={() => setShowScheduleDialog(true)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Agendar Partida
            </Button>
            <Button variant="outline" onClick={() => setShowEditDialog(true)}>
              <EditIcon className="h-4 w-4 mr-2" />
              Editar Torneio
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Equipes Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tournament.teams.length === 0 ? (
              <p className="text-gray-500">Nenhuma equipe se juntou ainda.</p>
            ) : (
              <div className="space-y-2">
                {tournament.teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{team.name}</span>
                    <span className="text-sm text-gray-500">{team.players.length} jogadores</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrophyIcon className="h-5 w-5 mr-2" />
              Tournament Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{tournament.rules}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matches</CardTitle>
          <CardDescription>All scheduled and completed matches</CardDescription>
        </CardHeader>
        <CardContent>
          {tournament.matches.length === 0 ? (
            <p className="text-gray-500">No matches scheduled yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournament.matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {tournament.teams.find((t) => t.id === match.homeTeamId)?.name} vs{" "}
                      {tournament.teams.find((t) => t.id === match.awayTeamId)?.name}
                    </TableCell>
                    <TableCell>
                      {match.homeScore !== undefined ? `${match.homeScore} - ${match.awayScore}` : "-"}
                    </TableCell>
                    <TableCell>{match.status}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Update Result
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {tournament && (
        <>
          <EditTournamentDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            tournament={tournament}
            onSuccess={handleEditSuccess}
          />
          <ScheduleMatchDialog
            open={showScheduleDialog}
            onOpenChange={setShowScheduleDialog}
            tournamentId={tournament.id}
            teams={tournament.teams}
            onSuccess={handleScheduleSuccess}
          />
        </>
      )}
    </div>
  )
}

