import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CellStatus } from '@/models/cellStatus'
import { useSettingsStore } from '@/stores/settingsStore'
import Cards from '@/data/cards'

export type NotebookMatrix = Record<string, Record<string, CellStatus>>

export const useNotebookStore = defineStore(
  'notebook',
  () => {
    const settingsStore = useSettingsStore()
    const myCardsIds = ref<string[]>([])
    const manualOverrides = ref<Record<string, CellStatus>>({})
    const undoStack = ref<string[]>([])
    const redoStack = ref<string[]>([])
    const undoSize = 50

    const toggleManualCell = (playerId: string, cardId: string) => {
      console.log('toggleManualCell')
      const key = `${playerId}_${cardId}`
      const currentManual = manualOverrides.value[key]

      if (currentManual === CellStatus.MAYBE) {
        delete manualOverrides.value[key]
      } else {
        saveManualOverrides()
        manualOverrides.value[key] = ((currentManual || CellStatus.UNKNOWN) % 4) + 1
      }

      return { [key]: currentManual }
    }

    const myCards = computed(() => {
      return myCardsIds.value.map(findCardById)
    })

    const matrix = computed(() => {
      const notebook = initNotebook()
      const ensureRow = (playerId: string): Record<string, CellStatus> => {
        return notebook[playerId] ?? (notebook[playerId] = {})
      }
      const setNotebookStatus = (playerId: string, cardId: string, status: CellStatus) => {
        ensureRow(playerId)[cardId] = status
      }
      const getNotebookStatus = (playerId: string, cardId: string): CellStatus => {
        return ensureRow(playerId)[cardId] ?? CellStatus.UNKNOWN
      }
      const myNotebook = ensureRow(settingsStore.you.id)
      // 1 AXIOM: My Cards
      Cards.forEach((card) => {
        if (myCardsIds.value.includes(card.id)) {
          // А. Якщо карта у мене Є
          myNotebook[card.id] = CellStatus.HAS

          // Відразу знаємо, що у інших її НЕМАЄ
          settingsStore.players.forEach((player) => {
            if (player.id !== settingsStore.you.id) {
              setNotebookStatus(player.id, card.id, CellStatus.HAS_NOT)
            }
          })
        } else {
          myNotebook[card.id] = CellStatus.HAS_NOT
        }
      })

      // 1.1 AXIOM: Manualy set
      Object.entries(manualOverrides.value).forEach(([key, status]) => {
        const [playerId, cardId] = key.split('_')
        if (!playerId || !cardId) return

        if (getNotebookStatus(playerId, cardId) !== undefined) {
          setNotebookStatus(playerId, cardId, status)

          if (status === CellStatus.HAS) {
            settingsStore.players.forEach((player) => {
              if (player.id !== playerId) {
                setNotebookStatus(player.id, cardId, CellStatus.HAS_NOT)
              }
            })
          }
        }
      })

      // 2. PROCESSING HISTORY
      settingsStore.suggestions.forEach((s) => {
        // CASE A: I asked (I'm seeing the cards)
        if (s.askedByPlayerId === settingsStore.you.id) {
          if (s.disprovedByPlayerId && s.shownCardId) {
            setNotebookStatus(s.disprovedByPlayerId, s.shownCardId, CellStatus.HAS)

            // If he has the card, others do not have it
            settingsStore.players.forEach((player) => {
              if (player.id !== s.disprovedByPlayerId && s.shownCardId) {
                setNotebookStatus(player.id, s.shownCardId, CellStatus.HAS_NOT)
              }
            })
          } else {
            // nobody disproved -> everyone has NOT
            settingsStore.players.forEach((player) => {
              if (player.id === settingsStore.you.id) return // Skip me
              setNotebookStatus(player.id, s.suspect.id, CellStatus.HAS_NOT)
              setNotebookStatus(player.id, s.weapon.id, CellStatus.HAS_NOT)
              setNotebookStatus(player.id, s.room.id, CellStatus.HAS_NOT)
            })
          }
        }

        // CASE B: Someone else asked
        else {
          if (s.disprovedByPlayerId) {
            const disprovedByPlayerId = s.disprovedByPlayerId
            const cardIds = [s.suspect.id, s.weapon.id, s.room.id]

            // Setting MAYBE for the disproving player
            if (disprovedByPlayerId !== settingsStore.you.id) {
              cardIds.forEach((cardId) => {
                // Safety check: Don't overwrite if we essentially know it's HAS_NOT
                if (getNotebookStatus(disprovedByPlayerId, cardId) === CellStatus.UNKNOWN) {
                  setNotebookStatus(disprovedByPlayerId, cardId, CellStatus.MAYBE)
                }
              })
            }

            // Logic of "skipped players" (they didn't respond -> they definitely don't have it)
            const askedByPlayerIdx = settingsStore.getPlayersIndex(s.askedByPlayerId)

            // Loop from the asker to the disprover
            for (let i = 1; i < settingsStore.players.length; i++) {
              const nextPlayerIdx = (askedByPlayerIdx + i) % settingsStore.players.length
              const nextPlayer = settingsStore.players[nextPlayerIdx]
              if (!nextPlayer) continue

              // Stop when we reached the disproving player
              if (nextPlayer.id === disprovedByPlayerId) break

              // All between players marked as HAS_NOT
              if (nextPlayer.id !== settingsStore.you.id) {
                cardIds.forEach((cardId) => {
                  setNotebookStatus(nextPlayer.id, cardId, CellStatus.HAS_NOT)
                })
              }
            }
          } else {
            // Nobody disproved -> No one has these cards (except possibly the asker)
            settingsStore.players.forEach((player) => {
              // 1. IMPORTANT: Skip the asker!
              // They might be bluffing with their own cards.
              if (player.id === s.askedByPlayerId) return

              // 2. Mark as HAS_NOT for everyone else (including ME)
              // Safety check: Don't overwrite if we essentially know it's HAS (e.g. my hand)
              if (getNotebookStatus(player.id, s.suspect.id) !== CellStatus.HAS) {
                setNotebookStatus(player.id, s.suspect.id, CellStatus.HAS_NOT)
              }

              if (getNotebookStatus(player.id, s.weapon.id) !== CellStatus.HAS) {
                setNotebookStatus(player.id, s.weapon.id, CellStatus.HAS_NOT)
              }

              if (getNotebookStatus(player.id, s.room.id) !== CellStatus.HAS) {
                setNotebookStatus(player.id, s.room.id, CellStatus.HAS_NOT)
              }
            })
          }
        }
      })

      // 3. DEDUCTION LEVEL
      settingsStore.players.forEach((player) => {
        // We collect all impossible cards for this player
        const impossibleCardsIds = Object.entries(ensureRow(player.id))
          .filter(([_, status]) => status === CellStatus.HAS_NOT)
          .map(([cardId, _]) => cardId)

        settingsStore.suggestions.forEach((s) => {
          // 1. Filter: only if this player disproved
          if (s.disprovedByPlayerId !== player.id) return
          // 2. Filter: if we already know which card he showed - skip
          if (s.shownCardId) return

          const involvedCardIds = [s.suspect.id, s.weapon.id, s.room.id]

          // 3. Crytical check
          // If we already know that he HAS one of these cards, deduction is impossible
          const alreadyHasCard = involvedCardIds.some((cardId) => {
            return getNotebookStatus(player.id, cardId) === CellStatus.HAS
          })

          // If we already know that he HAS one of these cards, deduction is impossible
          if (alreadyHasCard) return

          // 4. Now filter out impossible cards
          const possibleCardsIds = involvedCardIds.filter((c) => !impossibleCardsIds.includes(c))

          // 5. If only one possible card remains - bingo!
          if (possibleCardsIds.length === 1) {
            const deducedCardId = possibleCardsIds[0]
            if (!deducedCardId) return

            // Set status for the player
            setNotebookStatus(player.id, deducedCardId, CellStatus.HAS)

            // Update other players (they definitely don't have this card)
            settingsStore.players.forEach((otherPlayer) => {
              if (otherPlayer.id !== player.id) {
                setNotebookStatus(otherPlayer.id, deducedCardId, CellStatus.HAS_NOT)
              }
            })
          }
        })
      })

      return notebook
    })

    // --- Actions ---

    const initNotebook = () => {
      const notebook: NotebookMatrix = {}
      const playerIds = settingsStore.players.map((p) => p.id)
      playerIds.forEach((playerId) => {
        const playerNotebook: Record<string, CellStatus> = {}
        Cards.forEach((card) => (playerNotebook[card.id] = CellStatus.UNKNOWN))
        notebook[playerId] = playerNotebook
      })

      return notebook
    }

    const cardHasOwner = (cardId: string) => {
      console.log('cardId', cardId)
      const player = settingsStore.players.find((player) => {
        return matrix.value[player.id]?.[cardId] === CellStatus.HAS
      })
      console.log('player')
      return player ? player.id : null
    }

    const saveManualOverrides = () => {
      const snapshot = JSON.stringify(manualOverrides.value)
      undoStack.value.push(snapshot)
      redoStack.value = []
      if (undoStack.value.length > undoSize) {
        undoStack.value.shift()
      }
    }

    const undo = () => {
      if (!undoStack.value.length) return

      const currentSnapshot = JSON.stringify(manualOverrides.value)
      redoStack.value.push(currentSnapshot)

      const prevSnapshot = undoStack.value.pop()
      if (prevSnapshot) {
        manualOverrides.value = JSON.parse(prevSnapshot)
      }
    }

    const redo = () => {
      if (!redoStack.value.length) return

      const currentSnapshot = JSON.stringify(manualOverrides.value)
      undoStack.value.push(currentSnapshot)

      const nextSnapshot = redoStack.value.pop()
      if (nextSnapshot) {
        manualOverrides.value = JSON.parse(nextSnapshot)
      }
    }

    const resetNotebook = () => {
      myCardsIds.value = []
      manualOverrides.value = {}
      resetManualOverrides()
    }

    const resetManualOverrides = () => {
      manualOverrides.value = {}
      undoStack.value = []
      redoStack.value = []
    }

    const setMyCards = (cardIds: string[]) => {
      myCardsIds.value = cardIds
    }

    // --- Getters ---

    const findCardById = (id: string) => {
      return Cards.find((c) => c.id === id) || null
    }

    const getStatus = (playerId: string, cardId: string) => {
      return matrix.value[playerId]?.[cardId] || CellStatus.UNKNOWN
    }

    const isCardKnown = (cardId: string) => {
      return settingsStore.players.every((p) => getStatus(p.id, cardId) === CellStatus.HAS_NOT)
    }

    return {
      matrix,
      myCards,
      myCardsIds,
      manualOverrides,
      undoStack,
      redoStack,

      cardHasOwner,
      undo,
      redo,
      resetNotebook,
      toggleManualCell,
      initNotebook,
      setMyCards,
      findCardById,
      getStatus,
      resetManualOverrides,
      isCardKnown,
    }
  },
  {
    persist: true,
  },
)
