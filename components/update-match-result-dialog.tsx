/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Match } from "@/types"

interface UpdateMatchResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  match: Match
  onSuccess: (match: Match) => void
}

export function UpdateMatchResultDialog({ open, onOpenChange, match, onSuccess }: UpdateMatchResultDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch(`/api/matches/${match.id}/result`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeScore: Number.parseInt(formData.get("homeScore") as string),
          awayScore: Number.parseInt(formData.get("awayScore") as string),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update match result")
      }

      const updatedMatch = await response.json()
      onSuccess(updatedMatch)
      toast({
        title: "Success",
        description: "Match result updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update match result",
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
          <DialogTitle>Atualizar resultado da partida</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Pontuação do time da casa</label>
              <Input name="homeScore" type="number" min="0" defaultValue={match.homeScore} required />
            </div>
            <div>
              <label className="text-sm font-medium">Pontuação do time visitante</label>
              <Input name="awayScore" type="number" min="0" defaultValue={match.awayScore} required />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar resultado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

