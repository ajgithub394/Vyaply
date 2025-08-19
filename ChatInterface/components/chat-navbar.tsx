"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Moon, Sun, MessageCircle } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface Contact {
  id: string
  phoneNumber: string
  lastMessage: string
  timestamp: string
  unread: number
}

interface ChatNavbarProps {
  selectedContact: Contact | undefined
}

export function ChatNavbar({ selectedContact }: ChatNavbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-16 bg-blue-600 dark:bg-blue-700 flex items-center justify-between px-4 border-b border-blue-700 dark:border-blue-600">
      {/* Left side - App branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-white" />
          <span className="text-white font-semibold text-lg">ChatApp</span>
        </div>
      </div>

      {/* Center - Selected contact info */}
      <div className="flex items-center gap-3 flex-1 justify-center">
        {selectedContact && (
          <>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                {selectedContact.phoneNumber.slice(-4, -2)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <div className="text-white font-medium">{selectedContact.phoneNumber}</div>
              <div className="text-blue-100 text-sm">Online</div>
            </div>
          </>
        )}
      </div>

      {/* Right side - Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-white hover:bg-blue-700 dark:hover:bg-blue-600"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
