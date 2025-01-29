"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, CheckIcon, XIcon } from "lucide-react"
import type { Team } from "@/types"
import { CreateTeamDialog } from "@/components/create-team-dialog"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { user } = useAuth()

  const isAdmin = user?.role === "ADMIN"

  const handleApproveTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve team")
      }

      setTeams((prev) => prev.map((team) => (team.id === teamId ? { ...team, approved: true } : team)))
    } catch (error) {
      console.error("Error approving team:", error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Equipes</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma equipe encontrada</CardTitle>
            <CardDescription>Crie uma nova equipe para começar</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>Captain: {team.players.find((p) => p.id === team.captainId)?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Players: {team.players.length}</p>
                  <p className="text-sm text-gray-500">Status: {team.approved ? "Approved" : "Pending"}</p>
                  {isAdmin && !team.approved && (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleApproveTeam(team.id)} className="w-full">
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button size="sm" variant="destructive" className="w-full">
                        <XIcon className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTeamDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={(newTeam) => {
          setTeams((prev) => [...prev, newTeam])
          setShowCreateDialog(false)
        }}
      />
    </div>
  )
}

