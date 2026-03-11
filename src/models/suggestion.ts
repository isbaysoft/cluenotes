import { type Card } from './card'

export interface Suggestion {
  id: string
  askedByPlayerId: string
  disprovedByPlayerId: string | null
  suspect: Card
  weapon: Card
  room: Card
  nobodyDisproved: boolean
  accusing: boolean
  accustionConfirmed: boolean
  shownCardId: string | null

  createdAt: Date
}
