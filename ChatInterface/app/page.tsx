"use client"

import { ChatNavbar } from "@/components/chat-navbar"
import { ContactsSidebar } from "@/components/contacts-sidebar"
import { ChatArea } from "@/components/chat-area"
import { useChat } from "@/hooks/use-chat"

export default function ChatApp() {
  const { contacts, messages, selectedContact, loading, error, sendMessage, selectContact, clearError } = useChat()

  const selectedContactData = contacts.find((c) => c.id === selectedContact)
  const currentMessages = selectedContact ? messages[selectedContact] || [] : []

  // Clear error when user interacts
  const handleSendMessage = (text: string) => {
    if (error) clearError()
    sendMessage(text)
  }

  const handleSelectContact = (contactId: string) => {
    if (error) clearError()
    selectContact(contactId)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ContactsSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        loading={loading}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatNavbar selectedContact={selectedContactData} />
        <ChatArea
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          selectedContact={selectedContactData}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
