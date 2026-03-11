<template>
  <button :class="['button', { clicked }]" :disabled="disabled" @click="onClick">
    <span class="label-wrapper">
      <Transition name="slide-up" mode="out-in">
        <span :key="caption" class="label">
          <slot>{{ caption }}</slot>
        </span>
      </Transition>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineProps<{
  caption?: string
  disabled?: boolean
}>()

const emit = defineEmits(['click'])

const clicked = ref(false)

const onClick = () => {
  if (clicked.value) return

  clicked.value = true
  if (navigator.vibrate) {
    navigator.vibrate(200)
  }
  clicked.value = false
  emit('click')
}
</script>

<style lang="scss" scoped>
.button {
  --max-height: 60px;
  height: var(--max-height);
  max-height: var(--max-height);
  padding: 0 clamp(1rem, 6vw, 2rem);
  font-size: clamp(1rem, 5vw, 1.2rem);
  font-weight: 900;
  line-height: 1.1;
  color: white;
  text-transform: uppercase;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  transition:
    filter 0.2s,
    transform 0.1s;

  &:focus-visible {
    outline: 2px solid $yellow-main;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(2px); /* Эффект нажатия */
  }

  &.primary {
    background: linear-gradient(to bottom, #6ecf3d 0%, #3c9e0d 100%);
    border: 2px solid #2e7a0a;
    box-shadow:
      inset 0 3px 3px rgba(255, 255, 255, 0.6),
      inset 0 -3px 3px rgba(0, 0, 0, 0.2),
      0 6px 0 #1f5207,
      0 8px 10px rgba(0, 0, 0, 0.4);

    &:not(:disabled) {
      &:hover {
        filter: brightness(1.1);
      }

      &:active {
        box-shadow:
          inset 0 2px 2px rgba(255, 255, 255, 0.4),
          inset 0 -2px 2px rgba(0, 0, 0, 0.2),
          0 2px 0 #1f5207,
          0 4px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &.secondary {
    background: linear-gradient(to bottom, #5a9ad1 0%, #326891 100%);
    border: 2px solid #204663;
    box-shadow:
      inset 0 3px 3px rgba(255, 255, 255, 0.5),
      inset 0 -3px 3px rgba(0, 0, 0, 0.3),
      0 6px 0 #1a3b55,
      0 8px 10px rgba(0, 0, 0, 0.4);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }
  }

  &.small {
    padding: 0 $padding-sm;
    min-width: 60px;
  }

  &.slide {
    will-change: transform, opacity;
    display: grid;
    place-items: center;
    grid-template-areas: 'stack';

    span {
      grid-area: stack;
      white-space: nowrap;
      line-height: 1;
    }
  }

  &.ghost {
    background: rgba(255, 255, 255, 0.2);
    border: $border-width solid rgba(255, 255, 255, 0.4);
    color: white;
    border-radius: $border-radius;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: white;
    }
  }

  &.special {
    border-color: transparent;
    border-radius: $border-radius;
    background: $white;
    color: $black;
    display: flex;
    gap: $padding-sm;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
  }
}

.label-wrapper {
  display: inline-block;
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
}

.label {
  display: inline-block;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
