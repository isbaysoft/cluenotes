<template>
  <div class="step-accusation">
    <WizardHeader title="The Final Verdict" subtitle="Guilty or Innocent?" highlight="Final" tone="alert" />
    <CardsPicker :slots="cardSlots" :selectedCardId="selectedCardId" @onOpenPicker="selectCard" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDeckStore } from '@/stores/deckStore'
import { type Slot } from '@/models/game'
import { type Suggestion } from '@/models/suggestion'
import WizardHeader from '@/components/game/suggestion-wizard/shared/WizardHeader.vue'
import CardsPicker from '@/components/game/suggestion-wizard/shared/CardsPicker.vue'

const props = defineProps<{
  suggestion: Suggestion
}>()

const emit = defineEmits<{
  update: [accustionConfirmed: boolean]
}>()

const deckStore = useDeckStore()

const confirmedCard = deckStore.cardById('accusation-confirmed')!
const failedCard = deckStore.cardById('accusation-failed')!

const selectedCardId = computed(() => {
  return props.suggestion.accustionConfirmed ? confirmedCard.id : failedCard.id
})

const cardSlots = computed(() => {
  return [confirmedCard, failedCard].map((card) => {
    return {
      cardType: card.type,
      card,
    }
  })
})

const selectCard = (slot: Slot) => {
  if (slot.card) {
    emit('update', slot.card.id === 'accusation-confirmed')
  }
}
</script>

<style lang="scss" scoped>
.step-accusation {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
</style>
