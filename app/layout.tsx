import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Campeonato Desportivo de Direito",
  description: "Sistema de gestão de campeonatos para advogados",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      <html lang="PT-br">
        <body className={inter.className}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </body>
      </html>
    
  )
}

