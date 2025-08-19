export interface Contact {
  id: string
  phoneNumber: string
  lastMessage: string
  timestamp: string
  unread: number
  isOnline?: boolean
  lastSeen?: string
}

export interface Message {
  id: string
  text: string
  sender: "me" | "them"
  timestamp: string
  contactId: string
  status?: "sending" | "sent" | "delivered" | "read"
  type?: "text" | "image" | "file"
}

export interface ChatState {
  contacts: Contact[]
  messages: Record<string, Message[]>
  selectedContact: string | null
  loading: boolean
  error: string | null
}
