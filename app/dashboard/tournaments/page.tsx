"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import type { Tournament } from "@/types"
import { CreateTournamentDialog } from "@/components/create-tournament-dialog"
import { Loading } from "@/components/loading"
import { Error } from "@/components/error"
import { tournamentService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const isAdmin = user?.role === "ADMIN"

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await tournamentService.getAll()
      setTournaments(response.data)
    } catch (error) {
      setError("Failed to load tournaments")
      console.error("Error fetching tournaments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournaments()
  }, []) //Fixed: Added empty dependency array to useEffect

  const handleCreateSuccess = (newTournament: Tournament) => {
    setTournaments((prev) => [...prev, newTournament])
    setShowCreateDialog(false)
    toast({
      title: "Success",
      description: "Tournament created successfully",
    })
  }

  if (loading) {
    return <Loading message="Loading tournaments..." />
  }

  if (error) {
    return <Error message={error} onRetry={fetchTournaments} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Criar torneio
          </Button>
        )}
      </div>

      {tournaments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum torneio encontrado</CardTitle>
            <CardDescription>
              {isAdmin ? "Create a new tournament to get started" : "Check back later for upcoming tournaments"}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Card key={tournament.id}>
              <CardHeader>
                <CardTitle>{tournament.name}</CardTitle>
                <CardDescription>
                  {new Date(tournament.startDate).toLocaleDateString()} -{" "}
                  {new Date(tournament.endDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tournament.rules}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/tournaments/${tournament.id}`}>Ver detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTournamentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}

