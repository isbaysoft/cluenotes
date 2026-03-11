import { computed } from 'vue'
import { defineStore } from 'pinia'
import Cards from '@/data/cards'

export const useDeckStore = defineStore('deck', () => {
  const deckSize = computed(() => Cards.length)

  const suspects = computed(() => pickCardsByType('suspect'))

  const weapons = computed(() => pickCardsByType('weapon'))

  const rooms = computed(() => pickCardsByType('room'))

  const pickCardsByType = (type: string) => {
    return Object.entries(Cards)
      .filter((entry) => entry[1].type === type)
      .map((entry) => entry[1])
  }

  const cardsByType = (type: string) => {
    if (type === 'suspect') return suspects.value
    if (type === 'weapon') return weapons.value
    if (type === 'room') return rooms.value
    return []
  }

  const cardById = (id: string) => {
    return Cards.find((card) => card.id === id)
  }

  return {
    suspects,
    weapons,
    rooms,
    deckSize,

    cardsByType,
    cardById,
  }
})
