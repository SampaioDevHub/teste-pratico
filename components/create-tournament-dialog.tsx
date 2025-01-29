/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Tournament } from "@/types"

interface CreateTournamentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (tournament: Tournament) => void
}

export function CreateTournamentDialog({ open, onOpenChange, onSuccess }: CreateTournamentDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch("/api/tournaments", {
        method: "POST",
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
        throw new Error("Failed to create tournament")
      }

      const tournament = await response.json()
      onSuccess(tournament)
      toast({
        title: "Success",
        description: "Tournament created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tournament",
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
          <DialogTitle>Criar torneio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input name="name" placeholder="Nome do torneio" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input name="startDate" type="date" placeholder="Data de início" required />
            </div>
            <div>
              <Input name="endDate" type="date" placeholder="Data de término" required />
            </div>
          </div>
          <div>
            <Textarea name="rules" placeholder="Regras do Torneio" className="min-h-[100px]" required />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar torneio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

