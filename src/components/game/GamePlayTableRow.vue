<template>
  <tr>
    <td :colspan="settingsStore.players.length + 2">{{ title }}</td>
  </tr>
  <tr v-for="card in cards" :key="card.id">
    <td>
      {{ card.name }}
    </td>
    <td v-for="player in settingsStore.players" :key="player.id">
      <NotebookCell :playerId="player.id" :cardId="card.id" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { type Card } from '@/models/card'
import { useSettingsStore } from '@/stores/settingsStore.js'
import NotebookCell from '@/components/game/NotebookCell.vue'

const settingsStore = useSettingsStore()

defineProps<{
  cards: Card[]
  title: string
}>()
</script>
