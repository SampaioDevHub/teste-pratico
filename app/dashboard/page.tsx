"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrophyIcon, UsersIcon, CalendarIcon, BarChartIcon } from "lucide-react"
import RippleButton from "@/components/ui/ripple-button"

export default function DashboardPage() {
  const { user } = useAuth()

  const cards = [
    {
      title: "Torneios",
      description: "Ver e gerenciar torneios",
      icon: TrophyIcon,
      href: "/dashboard/tournaments",
      color: "text-yellow-600",
    },
    {
      title: "Equipes",
      description: "Gerencie suas equipes",
      icon: UsersIcon,
      href: "/dashboard/teams",
      color: "text-blue-600",
    },
    {
      title: "Partidas",
      description: "Ver as próximas partidas",
      icon: CalendarIcon,
      href: "/dashboard/matches",
      color: "text-green-600",
    },
    {
      title: "Classificações",
      description: "Verifique a classificação do torneio",
      icon: BarChartIcon,
      href: "/dashboard/rankings",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
        <p className="text-muted-foreground">Gerencie seus torneios e equipes a partir do seu painel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <card.icon className={`h-5 w-5 ${card.color}`} />
                {card.title}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={card.href}>View {card.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.role === "ADMIN" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Ações do administrador</CardTitle>
            <CardDescription>Ações rápidas para administradores</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RippleButton >
              <Link href="/dashboard/tournaments/new">Criar torneio</Link>
            </RippleButton>
            <RippleButton>
              <Link href="/dashboard/teams">Aprovar equipes</Link>
            </RippleButton>
            <RippleButton>
              <Link href="/dashboard/matches">Agendar Partidas</Link>
            </RippleButton>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

