<template>
  {{ icon }}
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNotebookStore } from '@/stores/notebookStore'
import { CellStatus } from '@/models/cellStatus'

const props = defineProps<{
  playerId: string
  cardId: string
}>()

const notebookStore = useNotebookStore()

const icon = computed(() => {
  switch (notebookStore.getStatus(props.playerId, props.cardId)) {
    case CellStatus.HAS:
      return 'X'
    case CellStatus.HAS_NOT:
      return 'O'
    case CellStatus.MAYBE:
      return '?'
    default:
      return ''
  }
})
</script>
