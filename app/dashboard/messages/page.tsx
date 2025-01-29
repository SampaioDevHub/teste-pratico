"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { SendIcon } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  createdAt: Date
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    // Connect to WebSocket and fetch messages
    // This would be replaced with actual WebSocket implementation
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      // Send message via WebSocket
      // This would be replaced with actual WebSocket implementation
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        content: newMessage,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
          <CardDescription>Converse com os participantes do torneio</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.senderId === user?.id ? "You" : message.senderName}
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <div className="text-xs mt-1 opacity-70">{new Date(message.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

