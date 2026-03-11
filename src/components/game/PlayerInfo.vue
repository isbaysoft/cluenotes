<template>
  <table class="player-info-table">
    <tbody>
      <tr>
        <th>You showed:</th>
        <td>
          <span v-if="!shownCards.length" class="card">Nothing</span>
          <div v-for="card in shownCards" :key="card.id" class="card" :class="card.type">
            {{ card.name }}
          </div>
        </td>
      </tr>
      <tr>
        <th>Player has:</th>
        <td>
          <span v-if="!playersCards.length" class="card">Unknown</span>
          <div v-for="card in playersCards" :key="card.id" class="card">{{ card.name }}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { type Player } from '@/models/player'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore' // Тот самый стор из предыдущих ответов
import { CellStatus } from '@/models/cellStatus'
import { type Card } from '@/models/card'

const props = defineProps<{
  player: Player
}>()

const settingsStore = useSettingsStore()
const notebookStore = useNotebookStore()

const shownCards = computed<Card[]>(() => {
  const youId = settingsStore.you?.id
  if (!youId) return []

  const shownCardsIds = settingsStore.suggestions
    .filter(
      (suggestion) =>
        suggestion.disprovedByPlayerId === youId &&
        suggestion.askedByPlayerId === props.player.id &&
        suggestion.shownCardId,
    )
    .map((suggestion) => suggestion.shownCardId)

  return [...new Set(shownCardsIds)]
    .map((shownCardId) => shownCardId ? notebookStore.findCardById(shownCardId) : null)
    .filter((card): card is Card => card !== null)
})

const playersCards = computed<Card[]>(() => {
  return Object.entries(notebookStore.matrix[props.player.id] ?? {})
    .filter(([_cardId, status]) => status === CellStatus.HAS)
    .map(([cardId]) => notebookStore.findCardById(cardId))
    .filter((card): card is Card => card !== null)
})
</script>

<style lang="scss" scoped>
.player-info-table {
  border-spacing: 0 $padding-sm;

  th {
    text-align: right;
    vertical-align: top;
    font-weight: 400;
  }

  td {
    text-align: left;
    display: flex;
    flex-direction: column;
    font-weight: 700;

    .card {
      margin-left: $padding-sm;
    }
  }
}
</style>
