<template>
  <div class="wizard-slider" role="progressbar" :aria-valuenow="currentStep" aria-valuemin="1" :aria-valuemax="totalSteps">
    <div class="track">
      <div class="track-fill" :style="{ width: progressWidth }"></div>
    </div>
    <span
      v-for="x in totalSteps"
      :key="x"
      class="step-pill"
      :class="{
        active: x === currentStep,
        done: x < currentStep,
      }"
    >
      {{ x }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  totalSteps: number
  currentStep: number
}>()

const progressWidth = computed(() => {
  if (props.totalSteps <= 1) return '100%'
  const ratio = (props.currentStep - 1) / (props.totalSteps - 1)
  return `${Math.max(0, Math.min(1, ratio)) * 100}%`
})
</script>

<style lang="scss" scoped>
.wizard-slider {
  position: relative;
  display: flex;
  width: 100%;
  gap: 0.55rem;
  align-items: center;
  justify-content: center;
  padding-top: 0.85rem;
  padding-bottom: 0.15rem;

  .track {
    position: absolute;
    left: calc(50% - min(34vw, 8rem));
    right: calc(50% - min(34vw, 8rem));
    height: 0.25rem;
    background: rgba($white, 0.25);
    border-radius: 999px;
    overflow: hidden;
    z-index: 0;
    transform: translateY(0.05rem);
  }

  .track-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, $yellow-main 0%, $orange-accent 100%);
    box-shadow: 0 0 8px rgba($orange-accent, 0.55);
    transition: width 0.28s ease;
  }

  .step-pill {
    width: 1.05rem;
    height: 1.05rem;
    border-radius: 999px;
    border: 2px solid rgba($white, 0.6);
    background: $blue-bg;
    color: rgba($white, 0.7);
    font-size: 0.58rem;
    font-weight: 900;
    display: grid;
    place-items: center;
    position: relative;
    z-index: 1;
    transition: all 0.25s ease;

    &.done {
      border-color: rgba($yellow-main, 0.75);
      background: $blue-bg;
      color: $yellow-main;
    }

    &.active {
      transform: scale(1.18);
      border-color: $orange-accent;
      background: $orange-accent;
      color: $blue-dark;
      box-shadow:
        0 0 0 0.15rem rgba($orange-accent, 0.28),
        0 0 10px rgba($orange-accent, 0.7);
    }
  }
}
</style>
