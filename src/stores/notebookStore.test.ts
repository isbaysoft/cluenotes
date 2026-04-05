import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { type Player } from '@/models/player'
import { type Card } from '@/models/card'
import { type Suggestion } from '@/models/suggestion'
import { CellStatus } from '@/models/cellStatus'
import Cards from '@/data/cards'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore'

const buildPlayer = (id: string, name: string, order: number, color: string): Player => {
  return { id, name, order, color }
}

const findCard = (id: string): Card => {
  const card = Cards.find((entry) => entry.id === id)
  if (!card) {
    throw new Error(`Card ${id} not found`)
  }
  return card
}

const buildSuggestion = ({
  id,
  askedByPlayerId,
  disprovedByPlayerId,
  suspectId,
  weaponId,
  roomId,
  shownCardId = null,
}: {
  id: string
  askedByPlayerId: string
  disprovedByPlayerId: string | null
  suspectId: string
  weaponId: string
  roomId: string
  shownCardId?: string | null
}): Suggestion => {
  return {
    id,
    askedByPlayerId,
    disprovedByPlayerId,
    suspect: findCard(suspectId),
    weapon: findCard(weaponId),
    room: findCard(roomId),
    nobodyDisproved: disprovedByPlayerId === null,
    accusing: false,
    accustionConfirmed: false,
    shownCardId,
    createdAt: new Date('2026-04-05T00:00:00.000Z'),
  }
}

describe('notebook matrix deductions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const settingsStore = useSettingsStore()
    const notebookStore = useNotebookStore()

    settingsStore.players = [
      buildPlayer('you', 'You', 0, '#0072B2'),
      buildPlayer('z', 'Z', 1, '#D55E00'),
      buildPlayer('s', 'S', 2, '#006E73'),
      buildPlayer('h', 'H', 3, '#6A1B9A'),
    ]
    settingsStore.currentPlayerId = 'you'
    settingsStore.suggestions = []

    notebookStore.resetNotebook()
    notebookStore.setMyCards([])
  })

  it('marks skipped players as HAS_NOT when you ask and someone later disproves', () => {
    const settingsStore = useSettingsStore()
    const notebookStore = useNotebookStore()

    settingsStore.suggestions = [
      buildSuggestion({
        id: 't1',
        askedByPlayerId: 'you',
        disprovedByPlayerId: 'h',
        suspectId: 'suspect-colonel-mustard',
        weaponId: 'weapon-revolver',
        roomId: 'room-dinning-room',
        shownCardId: 'room-dinning-room',
      }),
    ]

    const askedCards = ['suspect-colonel-mustard', 'weapon-revolver', 'room-dinning-room']
    askedCards.forEach((cardId) => {
      expect(notebookStore.getStatus('z', cardId)).toBe(CellStatus.HAS_NOT)
      expect(notebookStore.getStatus('s', cardId)).toBe(CellStatus.HAS_NOT)
    })

    expect(notebookStore.getStatus('h', 'room-dinning-room')).toBe(CellStatus.HAS)
  })

  it('continues deduction to fixpoint and upgrades MAYBE to HAS when only one card remains', () => {
    const settingsStore = useSettingsStore()
    const notebookStore = useNotebookStore()

    notebookStore.setMyCards([
      'weapon-candlestick',
      'room-billiard-room',
      'weapon-revolver',
    ])

    settingsStore.suggestions = [
      buildSuggestion({
        id: 't2-1',
        askedByPlayerId: 's',
        disprovedByPlayerId: 'h',
        suspectId: 'suspect-colonel-mustard',
        weaponId: 'weapon-candlestick',
        roomId: 'room-billiard-room',
      }),
      buildSuggestion({
        id: 't2-2',
        askedByPlayerId: 'z',
        disprovedByPlayerId: 's',
        suspectId: 'suspect-colonel-mustard',
        weaponId: 'weapon-revolver',
        roomId: 'room-library',
      }),
    ]

    expect(notebookStore.getStatus('s', 'room-library')).toBe(CellStatus.HAS)
  })

  it('deduces envelope card per category when all other cards already have known owners', () => {
    const settingsStore = useSettingsStore()
    const notebookStore = useNotebookStore()

    notebookStore.manualOverrides = {
      'z_suspect-miss-scarlett': CellStatus.HAS,
      's_suspect-colonel-mustard': CellStatus.HAS,
      'h_suspect-dr-orchid': CellStatus.HAS,
      'z_suspect-mr-green': CellStatus.HAS,
      's_suspect-mrs-peacock': CellStatus.HAS,
    }

    const envelopeCardId = 'suspect-professor-plum'
    settingsStore.players.forEach((player) => {
      expect(notebookStore.getStatus(player.id, envelopeCardId)).toBe(CellStatus.HAS_NOT)
    })
  })
})
