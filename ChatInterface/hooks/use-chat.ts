"use client"

import { useState, useEffect, useCallback } from "react"
import type { Contact, Message, ChatState } from "@/types/chat"

// Mock API functions - replace these with actual API calls
const mockApiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockContacts: Contact[] = [
  { id: "1", phoneNumber: "+1 (555) 123-4567", lastMessage: "Hey, how are you?", timestamp: "2:30 PM", unread: 2 },
  { id: "2", phoneNumber: "+1 (555) 987-6543", lastMessage: "See you tomorrow!", timestamp: "1:45 PM", unread: 0 },
  { id: "3", phoneNumber: "+1 (555) 456-7890", lastMessage: "Thanks for the help", timestamp: "12:15 PM", unread: 1 },
  {
    id: "4",
    phoneNumber: "+1 (555) 321-0987",
    lastMessage: "Let me know when you arrive",
    timestamp: "11:30 AM",
    unread: 0,
  },
  {
    id: "5",
    phoneNumber: "+1 (555) 654-3210",
    lastMessage: "Great job on the project!",
    timestamp: "Yesterday",
    unread: 0,
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", text: "Hey, how are you?", sender: "them", timestamp: "2:25 PM", contactId: "1" },
    { id: "2", text: "I'm doing great! How about you?", sender: "me", timestamp: "2:26 PM", contactId: "1" },
    {
      id: "3",
      text: "Pretty good, just working on some projects",
      sender: "them",
      timestamp: "2:30 PM",
      contactId: "1",
    },
  ],
  "2": [
    { id: "1", text: "Are we still meeting tomorrow?", sender: "me", timestamp: "1:40 PM", contactId: "2" },
    { id: "2", text: "Yes, at 3 PM right?", sender: "them", timestamp: "1:42 PM", contactId: "2" },
    { id: "3", text: "Perfect! See you tomorrow!", sender: "them", timestamp: "1:45 PM", contactId: "2" },
  ],
  "3": [
    { id: "1", text: "Could you help me with the code review?", sender: "them", timestamp: "12:10 PM", contactId: "3" },
    { id: "2", text: "I'll take a look now", sender: "me", timestamp: "12:12 PM", contactId: "3" },
    { id: "3", text: "Thanks for the help", sender: "them", timestamp: "12:15 PM", contactId: "3" },
  ],
  "4": [
    { id: "1", text: "I'm on my way to the office", sender: "me", timestamp: "11:25 AM", contactId: "4" },
    { id: "2", text: "Let me know when you arrive", sender: "them", timestamp: "11:30 AM", contactId: "4" },
  ],
  "5": [
    { id: "1", text: "The presentation went really well!", sender: "me", timestamp: "Yesterday", contactId: "5" },
    { id: "2", text: "Great job on the project!", sender: "them", timestamp: "Yesterday", contactId: "5" },
  ],
}

// API functions - replace with actual backend calls
export const chatApi = {
  async fetchContacts(): Promise<Contact[]> {
    await mockApiDelay(500)
    return mockContacts
  },

  async fetchMessages(contactId: string): Promise<Message[]> {
    await mockApiDelay(300)
    return mockMessages[contactId] || []
  },

  async sendMessage(contactId: string, text: string): Promise<Message> {
    await mockApiDelay(200)
    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contactId,
      status: "sent",
    }
    return newMessage
  },

  async markAsRead(contactId: string): Promise<void> {
    await mockApiDelay(100)
    // Mark messages as read
  },
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    contacts: [],
    messages: {},
    selectedContact: null,
    loading: true,
    error: null,
  })

  // Load contacts on mount
  useEffect(() => {
    loadContacts()
  }, [])

  // Load messages when contact is selected
  useEffect(() => {
    if (state.selectedContact) {
      loadMessages(state.selectedContact)
      markAsRead(state.selectedContact)
    }
  }, [state.selectedContact])

  const loadContacts = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const contacts = await chatApi.fetchContacts()
      setState((prev) => ({
        ...prev,
        contacts,
        loading: false,
        selectedContact: contacts.length > 0 ? contacts[0].id : null,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load contacts",
      }))
    }
  }

  const getLastMessageForContact = useCallback(
    (contactId: string): string => {
      const contactMessages = state.messages[contactId]
      if (!contactMessages || contactMessages.length === 0) {
        // Fallback to the mock data's lastMessage if no messages loaded yet
        const contact = state.contacts.find((c) => c.id === contactId)
        return contact?.lastMessage || "No messages yet"
      }

      const lastMessage = contactMessages[contactMessages.length - 1]
      return lastMessage.text
    },
    [state.messages, state.contacts],
  )

  const updateContactLastMessage = useCallback(
    (contactId: string) => {
      const contactMessages = state.messages[contactId]
      if (!contactMessages || contactMessages.length === 0) return

      const lastMessage = contactMessages[contactMessages.length - 1]

      setState((prev) => ({
        ...prev,
        contacts: prev.contacts.map((contact) =>
          contact.id === contactId
            ? {
                ...contact,
                lastMessage: lastMessage.text,
                timestamp: lastMessage.timestamp,
              }
            : contact,
        ),
      }))
    },
    [state.messages],
  )

  const loadMessages = async (contactId: string) => {
    try {
      const messages = await chatApi.fetchMessages(contactId)
      setState((prev) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [contactId]: messages,
        },
      }))

      setTimeout(() => updateContactLastMessage(contactId), 0)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load messages",
      }))
    }
  }

  const sendMessage = async (text: string) => {
    if (!state.selectedContact || !text.trim()) return

    const contactId = state.selectedContact

    // Optimistically add message
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: text.trim(),
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contactId,
      status: "sending",
    }

    setState((prev) => ({
      ...prev,
      messages: {
        ...prev.messages,
        [contactId]: [...(prev.messages[contactId] || []), tempMessage],
      },
      contacts: prev.contacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              lastMessage: tempMessage.text,
              timestamp: tempMessage.timestamp,
            }
          : contact,
      ),
    }))

    try {
      const sentMessage = await chatApi.sendMessage(contactId, text)

      // Replace temp message with actual message
      setState((prev) => ({
        ...prev,
        messages: {
          ...prev.messages,
          [contactId]: prev.messages[contactId].map((msg) => (msg.id === tempMessage.id ? sentMessage : msg)),
        },
        contacts: prev.contacts.map((contact) =>
          contact.id === contactId
            ? {
                ...contact,
                lastMessage: sentMessage.text,
                timestamp: sentMessage.timestamp,
              }
            : contact,
        ),
      }))
    } catch (error) {
      // Remove temp message on error and revert last message
      setState((prev) => {
        const remainingMessages = prev.messages[contactId].filter((msg) => msg.id !== tempMessage.id)
        const lastValidMessage = remainingMessages[remainingMessages.length - 1]

        return {
          ...prev,
          messages: {
            ...prev.messages,
            [contactId]: remainingMessages,
          },
          contacts: prev.contacts.map((contact) =>
            contact.id === contactId
              ? {
                  ...contact,
                  lastMessage: lastValidMessage ? lastValidMessage.text : "No messages yet",
                  timestamp: lastValidMessage ? lastValidMessage.timestamp : contact.timestamp,
                }
              : contact,
          ),
          error: error instanceof Error ? error.message : "Failed to send message",
        }
      })
    }
  }

  const selectContact = useCallback((contactId: string) => {
    setState((prev) => ({ ...prev, selectedContact: contactId }))
  }, [])

  const markAsRead = async (contactId: string) => {
    try {
      await chatApi.markAsRead(contactId)
      setState((prev) => ({
        ...prev,
        contacts: prev.contacts.map((contact) => (contact.id === contactId ? { ...contact, unread: 0 } : contact)),
      }))
    } catch (error) {
      // Silently fail for read receipts
    }
  }

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  return {
    ...state,
    sendMessage,
    selectContact,
    clearError,
    refreshContacts: loadContacts,
    getLastMessageForContact, // Export helper function for components
  }
}
