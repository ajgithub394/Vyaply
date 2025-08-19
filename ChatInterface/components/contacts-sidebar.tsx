"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Contact } from "@/types/chat"

interface ContactsSidebarProps {
  contacts: Contact[]
  selectedContact: string | null
  onSelectContact: (contactId: string) => void
  loading?: boolean
}

export function ContactsSidebar({ contacts, selectedContact, onSelectContact, loading }: ContactsSidebarProps) {
  if (loading) {
    return (
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Chats</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading contacts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Chats</h2>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No contacts found</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                selectedContact === contact.id && "border-l-4 border-blue-500",
              )}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                  {contact.phoneNumber.slice(-4, -2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground truncate">{contact.phoneNumber}</h3>
                  <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                      {contact.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
