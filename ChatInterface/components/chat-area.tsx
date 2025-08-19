"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message, Contact } from "@/types/chat"

interface ChatAreaProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  selectedContact: Contact | undefined
  loading?: boolean
  error?: string | null
}

export function ChatArea({ messages, onSendMessage, selectedContact, loading, error }: ChatAreaProps) {
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText)
      setInputText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-medium text-foreground mb-2">Welcome to ChatApp</h3>
          <p className="text-muted-foreground">Select a contact to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-800 p-3">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm",
                  message.sender === "me"
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-muted text-foreground border border-border rounded-bl-sm",
                )}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={cn("text-xs", message.sender === "me" ? "text-blue-100" : "text-muted-foreground")}>
                    {message.timestamp}
                  </p>
                  {message.sender === "me" && message.status && (
                    <span
                      className={cn("text-xs ml-2", message.status === "sending" ? "text-blue-200" : "text-blue-100")}
                    >
                      {message.status === "sending" ? "..." : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 bg-background border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-background border-border focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || loading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
