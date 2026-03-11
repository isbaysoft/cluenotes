<template>
  <div data-testid="step-hypothesis" class="step-hypothesis">
    <CardPicker :isOpen="picker.isOpen" :cardType="picker.type" :withNotebook="true"
      :pickedCardName="currentPickedCardName" hint="Tap card name. Grid is reference-only." @onSelect="selectCard"
      @onClose="picker.isOpen = false" />

    <div class="header-wrap">
      <Transition name="accusing-banner">
        <div v-if="props.suggestion.accusing" class="accusing-banner"></div>
      </Transition>
      <WizardHeader :title="headerTitle" subtitle="Who, with what, and where?" :highlight="askerName" />
    </div>

    <CardsPicker :slots="cardSlots" :suggestion="suggestion"
      :selectedCardId="suggestion.accusing ? 'final-guess' : null" @onOpenPicker="openPicker" />
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { type Card, type CardType, CARD_TYPES } from '@/models/card'
import { type Suggestion } from '@/models/suggestion'
import { type Slot } from '@/models/game'
import { useDeckStore } from '@/stores/deckStore'
import WizardHeader from '@/components/game/suggestion-wizard/shared/WizardHeader.vue'
import CardPicker from '@/components/shared/CardPicker.vue'
import CardsPicker from '@/components/game/suggestion-wizard/shared/CardsPicker.vue'

const props = defineProps<{
  suggestion: Suggestion
}>()

const settingsStore = useSettingsStore()
const deckStore = useDeckStore()
type SuggestionCardType = (typeof CARD_TYPES)[number]

const isSuggestionCardType = (type: CardType): type is SuggestionCardType => {
  return CARD_TYPES.includes(type as SuggestionCardType)
}

const picker = reactive({
  isOpen: false,
  type: undefined as SuggestionCardType | undefined,
  collection: [] as Card[],
})

const askerName = computed(() => {
  const id = props.suggestion.askedByPlayerId
  const player = settingsStore.players.find((p) => p.id === id)
  return player ? player.name : '"Player"'
})

const headerTitle = computed(() => {
  const verb = settingsStore.you.id === props.suggestion.askedByPlayerId ? 'are' : 'is'
  return `What ${verb} ${askerName.value} ${props.suggestion.accusing ? 'accusing' : 'asking'}?`
})

const currentPickedCardName = computed(() => {
  if (!picker.type) return ''
  return props.suggestion[picker.type]?.name || ''
})

const cardSlots = computed(() => {
  const slots: Slot[] = CARD_TYPES.map((cardType) => {
    const card = props.suggestion[cardType]

    return { cardType, card }
  })

  const finalGuess = deckStore.cardById('final-guess')
  if (finalGuess) {
    slots.push({
      cardType: finalGuess.type,
      card: finalGuess,
    })
  }

  return slots
})

const openPicker = (slot: Slot) => {
  if (slot.card?.id === 'final-guess') {
    props.suggestion.accusing = !props.suggestion.accusing
  } else if (isSuggestionCardType(slot.cardType)) {
    picker.type = slot.cardType
    picker.isOpen = true
  }
}

const selectCard = (card: Card) => {
  if (!picker.type) return
  props.suggestion[picker.type] = card
  picker.isOpen = false
}
</script>

<style lang="scss" scoped>
.step-hypothesis {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  .header-wrap {
    position: relative;
  }

  .accusing-banner {
    --rotate: -2deg;
    @include shadow;
    position: absolute;
    bottom: 0;
    left: -10%;
    width: 120%;
    height: 210%;
    background: linear-gradient(to bottom, #d32f2f 0%, #b71c1c 100%);
    transform: rotate(var(--rotate));
    z-index: 0;
    pointer-events: none;
  }

  :deep(.wizard-header) {
    position: relative;
    z-index: 1;
  }
}

.accusing-banner-enter-active {
  animation: accusing-in 0.42s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.accusing-banner-leave-active {
  animation: accusing-out 0.26s ease-in forwards;
}

@keyframes accusing-in {
  0% {
    opacity: 0;
    transform: translateY(-85%) rotate(var(--rotate));
  }

  70% {
    opacity: 1;
    transform: translateY(8px) rotate(var(--rotate));
  }

  100% {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotate));
  }
}

@keyframes accusing-out {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotate));
  }

  100% {
    opacity: 0;
    transform: translateY(-18%) rotate(var(--rotate));
  }
}
</style>
