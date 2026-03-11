<template>
  <div class="step-footer">
    <Button class="secondary small btn-back" :disabled="!canStepBack" @click="$emit('onPrevStep')">
      <span class="btn-inner">
        <icon-material-symbols-arrow-back-rounded class="btn-icon" />
        <span>BACK</span>
      </span>
    </Button>
    <Button class="ghost small btn-cancel btn-slide" :caption="isDirty ? 'Update' : 'Close'" @click="$emit('onCancel')">
      <span class="btn-inner">
        <icon-ic-baseline-close class="btn-icon" />
        <span>{{ isDirty ? 'UPDATE' : 'CLOSE' }}</span>
      </span>
    </Button>
    <Button data-testid="btn-next-step" class="primary small btn-next btn-slide" :disabled="!canProceed"
      @click="$emit('onNextStep')">
      <span class="btn-inner">
        <span>{{ secondText || 'NEXT' }}</span>
        <icon-material-symbols-arrow-right-alt-rounded class="btn-icon" />
      </span>
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Button from '@/components/shared/Button.vue'

const props = defineProps<{
  canProceed: boolean
  canStepBack: boolean
  isDirty: boolean
  isLastStep: boolean
  isEditing: boolean
  isAccusing: boolean
}>()
defineEmits(['onNextStep', 'onPrevStep', 'onCancel'])

const secondText = computed(() => {
  if (props.isLastStep) {
    return 'Finish'
  }
  if (props.isAccusing) {
    return 'Judge'
  }
  return 'Next'
})
</script>

<style lang="scss" scoped>
.step-footer {
  display: flex;
  align-items: flex-end;
  gap: 0.55rem;
  padding: 0.8rem 0 0.2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    background: linear-gradient(180deg, rgba($white, 0.06) 0%, rgba($white, 0.02) 100%);
    pointer-events: none;
  }

  .button {
    flex: 1 1 0;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .btn-back {
    flex-basis: 0.92;
    transform: rotate(-1deg) translateY(2px);

    .btn-inner {
      gap: 0.28rem;
      font-size: clamp(0.9rem, 3.8vw, 1rem);
      letter-spacing: 0.01em;
    }
  }

  .btn-cancel {
    flex-basis: 1.02;
    transform: rotate(0.6deg);

    .btn-inner {
      gap: 0.28rem;
      font-size: clamp(0.9rem, 3.9vw, 1rem);
      letter-spacing: 0.01em;
    }
  }

  .btn-next {
    flex-basis: 1.1;
    transform: rotate(-0.4deg);

    .btn-inner {
      gap: 0.28rem;
      font-size: clamp(0.9rem, 3.8vw, 1rem);
      letter-spacing: 0.01em;
    }
  }

  .btn-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    width: auto;
    white-space: nowrap;
  }

  .btn-icon {
    font-size: 1em;
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    line-height: 1;
  }
}

.btn-slide {
  display: grid;
  place-items: center;
  grid-template-areas: 'stack';

  span {
    grid-area: stack;
    white-space: nowrap;
    line-height: 1;
  }
}

@media (max-height: 760px) {
  .step-footer {
    gap: 0.45rem;
    padding-top: 0.55rem;

    .button {
      --max-height: 52px;
    }
  }
}
</style>
