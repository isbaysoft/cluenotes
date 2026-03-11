<template>
  <div data-testid="step-reveal" class="step-reveal-party">
    <WizardHeader :title="`WHAT DID ${disproverName} SHOW?`" subtitle="Log the secret evidence"
      :highlight="disproverName" />
    <CardsPicker :slots="cardSlots" :suggestion="suggestion" :selectedCardId="selectedCardId"
      @onOpenPicker="selectCard" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore'
import { useDeckStore } from '@/stores/deckStore'
import { CARD_TYPES } from '@/models/card'
import { type Slot } from '@/models/game'
import { type Suggestion } from '@/models/suggestion'
import WizardHeader from '@/components/game/suggestion-wizard/shared/WizardHeader.vue'
import CardsPicker from '@/components/game/suggestion-wizard/shared/CardsPicker.vue'

const props = defineProps<{
  suggestion: Suggestion
}>()

const settingsStore = useSettingsStore()
const notebookStore = useNotebookStore()
const deckStore = useDeckStore()

const disproverName = computed(() => {
  const id = props.suggestion.disprovedByPlayerId
  const player = settingsStore.players.find((p) => p.id === id)
  return player ? player.name.toUpperCase() : 'THEY'
})

const cardUnknow = deckStore.cardById('unknow-shown')!

const selectedCardId = computed(() => {
  return props.suggestion.nobodyDisproved ? cardUnknow.id : props.suggestion.shownCardId
})

const cardSlots = computed(() => {
  const slots = CARD_TYPES.map((cardType) => props.suggestion[cardType])
    .filter((card) => {
      if (props.suggestion.disprovedByPlayerId === settingsStore.you.id) {
        return notebookStore.myCardsIds.includes(card.id)
      } else {
        return !notebookStore.myCardsIds.includes(card.id)
      }
    })
    .map((card) => {
      return {
        cardType: card.type,
        card,
      }
    })

  if (
    [props.suggestion.disprovedByPlayerId, props.suggestion.askedByPlayerId].indexOf(
      settingsStore.you.id,
    ) === -1
  ) {
    slots.push({
      cardType: cardUnknow.type,
      card: cardUnknow,
    })
  }

  return slots
})

const selectCard = (slot: Slot) => {
  props.suggestion.shownCardId = slot.card ? slot.card.id : null
  props.suggestion.nobodyDisproved = !slot.card
}
</script>

<style lang="scss" scoped>
.step-reveal-party {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
</style>
