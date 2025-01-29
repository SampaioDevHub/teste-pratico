/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Tournament } from "@/types"

interface EditTournamentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournament: Tournament
  onSuccess: (tournament: Tournament) => void
}

export function EditTournamentDialog({ open, onOpenChange, tournament, onSuccess }: EditTournamentDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          startDate: formData.get("startDate"),
          endDate: formData.get("endDate"),
          rules: formData.get("rules"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update tournament")
      }

      const updatedTournament = await response.json()
      onSuccess(updatedTournament)
      toast({
        title: "Success",
        description: "Tournament updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tournament",
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
          <DialogTitle>Editar Torneio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input name="name" placeholder="Nome do torneio" defaultValue={tournament.name} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                name="startDate"
                type="date"
                defaultValue={new Date(tournament.startDate).toISOString().split("T")[0]}
                required
              />
            </div>
            <div>
              <Input
                name="endDate"
                type="date"
                defaultValue={new Date(tournament.endDate).toISOString().split("T")[0]}
                required
              />
            </div>
          </div>
          <div>
            <Textarea
              name="rules"
              placeholder="Regras do Torneio"
              defaultValue={tournament.rules}
              className="min-h-[100px]"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar Torneio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

