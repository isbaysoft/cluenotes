export const CARD_TYPES = ['suspect', 'weapon', 'room'] as const

export type CardType = (typeof CARD_TYPES)[number] | 'special'

export interface Card {
  id: string
  name: string
  type: CardType
  image: string
}
