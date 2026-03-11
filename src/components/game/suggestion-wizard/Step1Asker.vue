<template>
  <div data-testid="step-asker" class="step-asker">
    <WizardHeader title="Who is asking?" subtitle="Tap the player taking a turn" highlight="asking?" />

    <PlayerPicker :selectedPlayerId="suggestion.askedByPlayerId" @onSelect="selectPlayer" />
  </div>
</template>

<script lang="ts" setup>
import { type Suggestion } from '@/models/suggestion'
import { useSettingsStore } from '@/stores/settingsStore.js'
import PlayerPicker from '@/components/game/suggestion-wizard/shared/PlayerPicker.vue'
import WizardHeader from '@/components/game/suggestion-wizard/shared/WizardHeader.vue'

const props = defineProps<{
  suggestion: Suggestion
}>()

const settingsStore = useSettingsStore()

const selectPlayer = (pid: string) => {
  settingsStore.setCurrentPlayerId(pid)
  props.suggestion.askedByPlayerId = pid
}
</script>

<style lang="scss" scoped>
.step-asker {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
</style>
