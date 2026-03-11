import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Player, createPlayer } from '@/models/player'
import { type Suggestion } from '@/models/suggestion'
import { useNotebookStore } from '@/stores/notebookStore'

const DEFAULT_PLAYERS_COUNT = 4

export const useSettingsStore = defineStore(
  'settings',
  () => {
    function buildDefaultPlayers(): Player[] {
      return Array.from({ length: DEFAULT_PLAYERS_COUNT }, (_, i) => {
        const playerName = i === 0 ? 'You' : `Player ${i + 1}`
        return createPlayer(playerName, i)
      })
    }

    const hasActiveGame = ref(false)
    const players = ref<Player[]>(buildDefaultPlayers())
    const currentPlayerId = ref<string | null>(null)
    const suggestions = ref<Suggestion[]>([])
    const notebookStore = useNotebookStore()
    const maxPlayerCount = 6
    const playerCount = computed(() => players.value.length)

    const finalSuggestion = computed<Suggestion | null>(
      () => suggestions.value.find((suggestion) => suggestion.accustionConfirmed === true) ?? null,
    )

    const currentPlayer = computed(() => {
      return findPlayerById(currentPlayerId.value)
    })

    const you = computed<Player>(() => players.value[0] as Player)

    const findPlayerById = (id: string | null) => {
      if (!id) return null
      return players.value.find((p) => p.id === id) || null
    }

    const initNewGame = () => {
      if (!players.value.length) {
        players.value = buildDefaultPlayers()
      }
      hasActiveGame.value = false
      currentPlayerId.value = null
      suggestions.value = []
      notebookStore.resetNotebook()
    }

    const resetSuggestions = () => {
      suggestions.value = []
    }

    const startNewGame = () => {
      hasActiveGame.value = true
    }

    const setCurrentPlayerId = (pid: string) => {
      currentPlayerId.value = pid
    }

    const setNextCurrentPlayerId = () => {
      const currentIndex = getPlayersIndex(currentPlayerId.value)
      const nextPlayerIdx = currentIndex + 1
      const nextPlayer = players.value[nextPlayerIdx % playerCount.value]
      if (nextPlayer) {
        currentPlayerId.value = nextPlayer.id
      }
    }

    const getPlayersIndex = (playerId: string | null) => {
      return players.value.findIndex((p) => p.id === playerId)
    }

    const addPlayer = () => {
      const order = players.value.length
      players.value.push(createPlayer(`Player ${order + 1}`, order))
    }

    const pickPlayer = (id: string) => {
      return players.value.find((p: Player) => p.id === id)
    }

    const removePlayer = (id: string) => {
      players.value = players.value.filter((player) => player.id !== id)
      players.value.forEach((player, index) => {
        player.order = index
      })
    }

    const addSuggestion = (suggestion: Suggestion) => {
      suggestions.value.push(suggestion)
    }

    const editSuggestion = (suggestion: Suggestion) => {
      const idx = suggestions.value.findIndex(({ id }) => id === suggestion.id)
      if (idx !== -1) {
        suggestions.value[idx] = suggestion
      }
    }

    const removeSuggestion = (id: string) => {
      suggestions.value = suggestions.value.filter((suggestion) => suggestion.id !== id)
    }

    return {
      hasActiveGame,
      players,
      currentPlayerId,
      suggestions,

      you,
      currentPlayer,
      maxPlayerCount,
      playerCount,
      initNewGame,
      findPlayerById,
      startNewGame,
      setCurrentPlayerId,
      setNextCurrentPlayerId,
      resetSuggestions,
      getPlayersIndex,
      addPlayer,
      pickPlayer,
      removePlayer,
      addSuggestion,
      editSuggestion,
      removeSuggestion,
      finalSuggestion,
    }
  },
  {
    persist: true,
  },
)
