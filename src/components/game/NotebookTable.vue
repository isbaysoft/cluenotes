<template>
  <div class="notebook-table">
    <table data-testid="notebook-table" :class="{ readonly: settingsStore.finalSuggestion }">
      <colgroup>
        <col style="width: 99%" />
        <col style="width: 1%" />
      </colgroup>
      <thead>
        <tr class="grid-header">
          <th>
            <slot name="corner"></slot>
          </th>
          <th>
            <div class="row-wrapper">
              <div class="row-container">
                <div v-for="player in players" :key="player.id" class="row-cell">
                  <div class="player-avatar-wrapper" @click="showPlayerInfo(player)">
                    <PlayerAvatar :player="player" />
                  </div>
                </div>
              </div>
            </div>
          </th>
        </tr>
        <tr v-if="settingsStore.finalSuggestion">
          <th colspan="2">
            <Winner />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="type in currentCardTypes" :key="type">
          <tr class="grid-row grid-row-type-header" :class="type">
            <th colspan="2">
              {{ type }}
            </th>
          </tr>
          <tr data-testid="notebook-card-select" v-for="card in deckStore.cardsByType(type)" :key="card.id"
            class="grid-row" :class="getRowClass(card)" @click="cardSelect(card)">
            <td>
              <div class="card-label-cell">
                <div class="card-name">
                  <icon-solar-star-bold v-if="isRowCompleted(card.id) && !shouldHideSolvedIndicators" />
                  <div v-for="word in card.name.split(' ')" :key="`${card.id}-${word}`">
                    {{ word }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="row-wrapper">
                <div class="row-container">
                  <button v-for="player in players" :key="player.id" class="grid-cell row-cell"
                    :disabled="player.id === settingsStore.you?.id" @click="cycleCellStatus(player.id, card.id)">
                    <span class="cell-marker" :class="getCellClass(player.id, card.id)">
                      <span class="cell-counter">{{ howMuchAsked(player.id, card.id) }}</span>
                      <span>{{ getCellSymbol(player.id, card.id) }}</span>
                    </span>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { useDeckStore } from '@/stores/deckStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore'
import { CellStatus } from '@/models/cellStatus'
import { type Card, type CardType, CARD_TYPES } from '@/models/card'
import { type Player } from '@/models/player'
import { modalService } from '@/services/modal/service'
import { toastService } from '@/services/toast/service'
import PlayerAvatar from '@/components/shared/PlayerAvatar.vue'
import PlayerInfo from '@/components/game/PlayerInfo.vue'
import Winner from '@/components/game/Winner.vue'

const props = defineProps<{
  cardType?: CardType
  cardSelectMode?: boolean
  hideCards?: boolean
  autoHideProgress?: number
}>()

const emit = defineEmits(['onSelectCard'])

const deckStore = useDeckStore()
const settingsStore = useSettingsStore()
const notebookStore = useNotebookStore()
const players = computed(() => settingsStore.players)

const currentCardTypes = computed(() => {
  return props.cardType ? [props.cardType] : CARD_TYPES
})

const shouldHideSolvedIndicators = computed(() => {
  return !!props.hideCards || (props.autoHideProgress ?? 100) < 100
})

const getCellStatus = (pid: string, cid: string) => notebookStore.getStatus(pid, cid)

const getCellSymbol = (pid: string, cid: string) => {
  const s = getCellStatus(pid, cid)
  if (s === CellStatus.HAS_NOT) return '✕'
  if (s === CellStatus.HAS) return '✓'
  if (s === CellStatus.MAYBE) return '?'
  return ''
}

const getCellClass = (pid: string, cid: string) => {
  const s = getCellStatus(pid, cid)
  return {
    'status-no': s === CellStatus.HAS_NOT,
    'status-yes': s === CellStatus.HAS,
    'status-maybe': s === CellStatus.MAYBE,
    'hidden': props.hideCards,
  }
}

const howMuchAsked = (playerId: string, cardId: string) => {
  if (playerId === settingsStore.you?.id) return null

  const counter = settingsStore.suggestions
    .filter((suggestion) => suggestion.askedByPlayerId === playerId)
    .filter((suggestion) => {
      return (
        suggestion.suspect.id === cardId ||
        suggestion.weapon.id === cardId ||
        suggestion.room.id === cardId
      )
    }).length

  return counter > 0 ? counter : null
}

const cycleCellStatus = async (pid: string, cid: string, force: boolean = false) => {
  if (props.cardSelectMode) return
  if (pid === settingsStore.you?.id) return
  if (settingsStore.finalSuggestion) return

  if (!force && isRowCompleted(cid)) {
    const confirmed = await modalService.open({
      type: 'confirmation',
      title: 'Overwrite Evidence?',
      body: 'This row is already solved. Changing it will undo your current solution.',
      confirmButtonText: 'Overwrite',
    })

    if (!confirmed) return
  }
  const ownerPid = notebookStore.cardHasOwner(cid)
  if (ownerPid && ownerPid !== pid) {
    const playerName = settingsStore.findPlayerById(ownerPid)?.name
    if (!playerName) return
    toastService.add({
      title: 'Contradiction found',
      message: `That is impossible. The evidence proves that ${playerName} already holds this card.`,
      type: 'warning',
    })
    return
  }

  notebookStore.toggleManualCell(pid, cid)
}

const cardSelect = (card: Card) => {
  if (props.cardSelectMode) {
    emit('onSelectCard', card)
  }

  return false
}

const getRowClass = (card: Card) => {
  if (shouldHideSolvedIndicators.value) return {}

  return {
    'row-crossed': isCardCrossedOut(card.id),
    'row-completed': isRowCompleted(card.id),
  }
}

const isRowCompleted = (cardId: string) => {
  const suggestion = settingsStore.finalSuggestion

  if (suggestion) {
    return CARD_TYPES.some((cardType) => suggestion[cardType].id === cardId)
  }

  return notebookStore.isCardKnown(cardId)
}

const isCardCrossedOut = (cid: string) => {
  return players.value.some((p) => notebookStore.getStatus(p.id, cid) === CellStatus.HAS)
}

const showPlayerInfo = async (player: Player) => {
  if (settingsStore.you?.id === player.id) return

  await modalService.open({
    type: 'information',
    title: player.name,
    body: h(PlayerInfo, { player }),
  })
}
</script>

<style lang="scss" scoped>
$grey-light: #f0f2f5;
$border-color: #cfd8dc;

.notebook-table {
  table {
    border-collapse: collapse !important;
    margin-bottom: calc(56px + (2rem));

    td,
    th {
      padding: 0;
      margin: 0;
      border: none;
    }

    .row-wrapper {
      overflow: hidden;

      .row-container {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        gap: 1px;
        border-bottom: 1px solid transparent;
        border-top: 1px solid transparent;

        .row-cell {
          flex: 1;
          overflow: hidden;
          min-width: 42px;
          border-bottom: 1px solid transparent;
        }
      }
    }

    .player-avatar-wrapper {
      padding: $padding-xsm;
    }

    .grid-header {
      position: sticky;
      top: 0;
      z-index: 5;
      height: 3rem;

      th {
        background: $top-nav-color;
      }

      .row-container {
        // Prevent subpixel seams while parent drawer is animating.
        background: $top-nav-color;
      }
    }

    .card-name {
      display: flex;
      gap: 4px;
    }

    .grid-row {
      min-height: 50px;

      &.grid-row-type-header {
        th {
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          align-items: center;
        }

        @include each-card-color using ($type, $color) {
          th {
            background: $color;
          }
        }
      }

      .card-label-cell {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 15px;
        font-weight: 700;
        font-size: 1rem;
        color: #222;
        line-height: 1.2;
      }

      &.row-crossed {
        td {
          background: #f3f4f6;
        }

        .card-label-cell {
          text-decoration: line-through;
          color: #70757a;
        }
      }

      &.row-completed {
        position: relative;
        z-index: 1;
        will-change: box-shadow;
        animation: pulse-guilty 2s infinite;
        border-radius: 4px;

        td {
          background: $yellow-main;
        }
      }
    }

    .grid-cell {
      border: none;
      border-left: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      max-height: 50px;
      max-width: 50px;
      min-height: 42px;
      min-width: 42px;
      aspect-ratio: 1 / 1;
      border-radius: $border-radius;
      background: rgba($black, 0.05);

      &:disabled {
        cursor: not-allowed;
      }

      .cell-marker {
        font-size: 1.4rem;
        font-weight: 900;
        color: $white;
        border-radius: $border-radius;
        position: relative;
        width: 100%;
        height: 100%;
        text-align: unset;
        display: flex;
        align-items: center;
        justify-content: center;

        .cell-counter {
          font-size: 0.78rem;
          font-weight: 800;
          color: $black;
          position: absolute;
          left: -1px;
          top: -1px;
          padding: 0 3px;
          background: $white;
          border-bottom-right-radius: 6px;
        }

        &.status-no {
          background: $color-no;
        }

        &.status-yes {
          background: $color-yes;
        }

        &.status-maybe {
          background: $color-maybe;
          color: $black;
        }

        opacity: var(--autoHideProgress, 1);

        &.hidden {
          opacity: 0;
        }
      }
    }

    &.readonly {
      .grid-cell {
        cursor: default;
      }
    }
  }
}

@keyframes pulse-guilty {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(46, 204, 113, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
}
</style>
