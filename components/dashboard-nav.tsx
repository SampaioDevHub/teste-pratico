"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
  BarChartIcon,
  MessageSquareIcon,
  LogOutIcon,
  HomeIcon,
} from "lucide-react"
import { Card } from "./ui/card"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Torneios",
    href: "/dashboard/tournaments",
    icon: TrophyIcon,
  },
  {
    title: "Equipes",
    href: "/dashboard/teams",
    icon: UsersIcon,
  },
  {
    title: "Partidas",
    href: "/dashboard/matches",
    icon: CalendarIcon,
  },
  {
    title: "Classificações",
    href: "/dashboard/rankings",
    icon: BarChartIcon,
  },
  {
    title: "Mensagens",
    href: "/dashboard/messages",
    icon: MessageSquareIcon,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Card className="flex h-full w-64 flex-col bg-[#f3f4f6] text-white shadow-md rounded-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-black">Direito Desportivo</h2>
        <p className="text-sm text-black">Bem-vindo, {user?.name}</p>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium  ",
                isActive ? "bg-red-600 text-white" : "text-black",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4">
        <Link href={'/login'}>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300"

          >
            <LogOutIcon className="mr-2 h-5 w-5" />
            Sair
          </Button>
        </Link>
      </div>
    </Card>
  )
}

