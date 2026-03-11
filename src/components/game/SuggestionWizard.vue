<template>
  <div class="wizard-overlay">
    <div class="wizard-card">
      <component class="step-component" :is="currentStepComponent" :suggestion="draftSuggestion"
        @update="updateAccusation" />
      <WizardSlider :totalSteps="totalSteps" :currentStep="currentStep" />
      <StepFooter :canProceed="canProceed" :canStepBack="canStepBack" :isDirty="isDirty"
        :isLastStep="currentStep === totalSteps" :isEditing="isEditing"
        :isAccusing="currentStep === 2 && draftSuggestion.accusing" @onNextStep="nextStepComponent"
        @onPrevStep="prevStepComponent" @onCancel="close" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue'
import Step1Asker from '@/components/game/suggestion-wizard/Step1Asker.vue'
import Step2Hypothesis from '@/components/game/suggestion-wizard/Step2Hypothesis.vue'
import Step21Accusation from '@/components/game/suggestion-wizard/Step21Accusation.vue'
import Step3Response from '@/components/game/suggestion-wizard/Step3Response.vue'
import Step4Reveal from '@/components/game/suggestion-wizard/Step4Reveal.vue'
import StepFooter from '@/components/game/suggestion-wizard/shared/StepFooter.vue'
import WizardSlider from '@/components/game/suggestion-wizard/shared/WizardSlider.vue'
import { modalService } from '@/services/modal/service'

import { useSettingsStore } from '@/stores/settingsStore.js'
import { type Suggestion } from '@/models/suggestion'
import { type Card } from '@/models/card'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  suggestion?: Suggestion
}>()
const emit = defineEmits(['onClose'])

const settingsStore = useSettingsStore()
const currentStep = ref(1)

const buildSuggestion = (): Suggestion => {
  return {
    id: uuidv4(),
    askedByPlayerId: settingsStore.currentPlayerId!,
    disprovedByPlayerId: null,
    suspect: null as unknown as Card,
    weapon: null as unknown as Card,
    room: null as unknown as Card,
    shownCardId: '',
    nobodyDisproved: false,
    accusing: false,
    accustionConfirmed: false,
    createdAt: new Date(),
  }
}

const draftSuggestion = ref<Suggestion>(
  props.suggestion ? { ...props.suggestion } : buildSuggestion()
)

onBeforeMount(() => {

  // debugging
  // suggestion.disprovedByPlayerId = settingsStore.currentPlayerId
  // suggestion.askedByPlayerId = settingsStore.you.id
  // suggestion.suspect = deckStore.suspects[0]
  // suggestion.weapon = deckStore.weapons[0]
  // suggestion.room = deckStore.rooms[0]
  // currentStep.value = 1
})

const currentStepComponent = computed(() => {
  switch (currentStep.value) {
    case 1:
      return Step1Asker
    case 2:
      return Step2Hypothesis
    case 3:
      if (draftSuggestion.value.accusing) {
        return Step21Accusation
      }
      return Step3Response
    case 4:
      return Step4Reveal
    default:
      return Step1Asker
  }
})
const totalSteps = computed(() => {
  if (draftSuggestion.value.accusing) {
    return 3
  }
  if (draftSuggestion.value.askedByPlayerId === settingsStore.you.id) {
    return draftSuggestion.value.nobodyDisproved ? 3 : 4
  }
  if (draftSuggestion.value.disprovedByPlayerId) {
    return draftSuggestion.value.disprovedByPlayerId === settingsStore.you.id ? 4 : 3
  }
  return draftSuggestion.value.nobodyDisproved ? 3 : 4
})

const isEditing = computed(() => {
  return !!props.suggestion
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return !!draftSuggestion.value.askedByPlayerId
    case 2:
      return !!(draftSuggestion.value.suspect && draftSuggestion.value.weapon && draftSuggestion.value.room)
    case 3:
      if (draftSuggestion.value.accusing) return true
      return !!draftSuggestion.value.disprovedByPlayerId || draftSuggestion.value.nobodyDisproved
    case 4:
      return !!draftSuggestion.value.shownCardId || draftSuggestion.value.nobodyDisproved
    default:
      return false
  }
})

const canStepBack = computed(() => {
  return currentStep.value > 1
})

const isDirty = computed(() => {
  if (!isEditing.value || !props.suggestion) return false

  const excludeProps = ['id', 'createdAt']

  return Object.keys(draftSuggestion.value)
    .filter((key) => !excludeProps.includes(key))
    .some((key) => (draftSuggestion.value as unknown as Record<string, unknown>)[key] !== (props.suggestion as unknown as Record<string, unknown>)[key])
})



const nextStepComponent = () => {
  if (currentStep.value >= totalSteps.value) {
    finishTurn()
  } else {
    currentStep.value++
  }
}

const prevStepComponent = () => {
  setTimeout(() => {
    if (canStepBack.value) {
      if (currentStep.value === 2 && draftSuggestion.value.accusing) {
        draftSuggestion.value.accusing = false
      }
      currentStep.value--
    }
  }, 200)
}

const finishTurn = async () => {
  if (isEditing.value) {
    if (isDirty.value) {
      const result = await update()
      if (result === null) return
    }
  } else {
    save()
  }

  emit('onClose')
}

const save = async () => {
  settingsStore.addSuggestion(draftSuggestion.value)
  settingsStore.setNextCurrentPlayerId()
}

const update = async () => {
  const result = await modalService.open({
    type: 'confirmation',
    title: 'Rewrite the Record?',
    body: 'You are altering a logged move. This will change the investigation timeline.',
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    canClose: true,
  })

  if (result === true) {
    settingsStore.editSuggestion(draftSuggestion.value)
  }

  return result
}

const close = async () => {
  if (isEditing.value && isDirty.value) {
    finishTurn()
    return
  }

  emit('onClose')
}

const updateAccusation = (accustionConfirmed: boolean) => {
  draftSuggestion.value.accustionConfirmed = accustionConfirmed
}

</script>

<style lang="scss" scoped>
.wizard-overlay {
  @include game-bg;

  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  height: 100dvh;
  min-height: 100svh;
  width: 100%;
  max-width: min(100vw, $max-width-app);
  left: 50%;
  transform: translateX(-50%);
  will-change: opacity;
  animation: fade-out 0.3s forwards;
  opacity: 0;
}

.wizard-card {
  display: flex;
  flex-direction: column;
  width: min(100vw, $max-width-app);
  height: 100dvh;
  min-height: 100svh;
  overflow: hidden;
  padding: $padding;

  .step-component {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

@keyframes fade-out {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
