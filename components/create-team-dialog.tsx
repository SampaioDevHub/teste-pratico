/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Team } from "@/types"

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (team: Team) => void
}

export function CreateTeamDialog({ open, onOpenChange, onSuccess }: CreateTeamDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          tournamentId: formData.get("tournamentId"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create team")
      }

      const team = await response.json()
      onSuccess(team)
      toast({
        title: "Success",
        description: "Team created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Criar equipe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input name="name" placeholder="Nome da equipe" required />
          </div>
          <div>
            <Select name="tournamentId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o torneio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament-1">Torneio 1</SelectItem>
                <SelectItem value="tournament-2">Torneio 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar equipe"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

