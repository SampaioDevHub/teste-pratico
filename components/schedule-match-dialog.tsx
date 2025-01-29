/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Match, Team } from "@/types"

interface ScheduleMatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournamentId: string
  teams: Team[]
  onSuccess: (match: Match) => void
}

export function ScheduleMatchDialog({ open, onOpenChange, tournamentId, teams, onSuccess }: ScheduleMatchDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentId,
          homeTeamId: formData.get("homeTeam"),
          awayTeamId: formData.get("awayTeam"),
          date: formData.get("date"),
          time: formData.get("time"),
          location: formData.get("location"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule match")
      }

      const match = await response.json()
      onSuccess(match)
      toast({
        title: "Success",
        description: "Match scheduled successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule match",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Partida</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select name="homeTeam" required>
                <SelectTrigger>
                  <SelectValue placeholder="Time da casa" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select name="awayTeam" required>
                <SelectTrigger>
                  <SelectValue placeholder="Time visitante" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input name="date" type="date" required />
            </div>
            <div>
              <Input name="time" type="time" required />
            </div>
          </div>
          <div>
            <Input name="location" placeholder="Localização da partida" required />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Agendamento..." : "Agendar Partida"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

