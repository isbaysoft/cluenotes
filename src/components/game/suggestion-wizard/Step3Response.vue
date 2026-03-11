<template>
  <div data-testid="step-response" class="step-response">
    <WizardHeader title="Did anyone stop the suggestion?" subtitle="Check players clockwise" highlight="stop"
      tone="alert" />

    <PlayerPicker :selectedPlayerId="suggestion.disprovedByPlayerId" :exclude="excludePlayers"
      :disproved="suggestion.nobodyDisproved" :allowDisprove="true" selectedLabel="STOPPED" @onSelect="setDisprover" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore'
import { type Suggestion } from '@/models/suggestion'
import WizardHeader from '@/components/game/suggestion-wizard/shared/WizardHeader.vue'
import PlayerPicker from '@/components/game/suggestion-wizard/shared/PlayerPicker.vue'

const props = defineProps<{
  suggestion: Suggestion
}>()

const settingsStore = useSettingsStore()
const notebookStore = useNotebookStore()

const youCanDisprove = computed(() => {
  const { suspect, weapon, room } = props.suggestion
  const involvedCardIds = [suspect.id, weapon.id, room.id]
  return notebookStore.myCardsIds.some((myCardsId) => involvedCardIds.includes(myCardsId))
})

const excludePlayers = computed(() => {
  const excludeIds = [
    props.suggestion.askedByPlayerId,
    youCanDisprove.value ? null : settingsStore.you.id,
  ].filter(Boolean)
  return settingsStore.players
    .map((player) => player.id)
    .filter((playerId) => excludeIds.includes(playerId))
})

const setDisprover = (pid: string | null) => {
  if (pid) {
    props.suggestion.disprovedByPlayerId = pid
    props.suggestion.nobodyDisproved = false
  } else {
    props.suggestion.disprovedByPlayerId = null
    props.suggestion.nobodyDisproved = true
    props.suggestion.shownCardId = null
  }
}
</script>

<style lang="scss" scoped>
.step-response {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
</style>
