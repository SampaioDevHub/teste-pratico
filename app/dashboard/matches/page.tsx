"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Match, } from "@/types"
import { UpdateMatchResultDialog } from "@/components/update-match-result-dialog"

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const { user } = useAuth()

  const isAdmin = user?.role === "ADMIN"

  const handleUpdateResult = (match: Match) => {
    setSelectedMatch(match)
    setShowUpdateDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Partidas</h1>
        <Select defaultValue="todos">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as partidas</SelectItem>
            <SelectItem value="agendado">Agendada</SelectItem>
            <SelectItem value="em andamento">Em andamento</SelectItem>
            <SelectItem value="finalizado">Finalizada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Partidas</CardTitle>
          <CardDescription>Próximas partidas agendadas em todos os torneios</CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <p className="text-gray-500">Nenhuma partida agendada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Torneio</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Equipes</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead>Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>Nome do torneio</TableCell>
                    <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                    <TableCell>Time A vs Time B</TableCell>
                    <TableCell>{match.location}</TableCell>
                    <TableCell>{match.status}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateResult(match)}>
                          Atualizar resultado
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

      {selectedMatch && (
        <UpdateMatchResultDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          match={selectedMatch}
          onSuccess={(updatedMatch) => {
            setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)))
            setShowUpdateDialog(false)
          }}
        />
      )}
    </div>
  )
}

