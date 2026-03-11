import { type CardType, type Card } from '@/models/card'

export interface Slot {
  cardType: CardType
  card: Card | null
}
