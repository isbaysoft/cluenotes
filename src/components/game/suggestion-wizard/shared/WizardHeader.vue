<template>
  <div class="wizard-header" :class="`tone-${tone}`">
    <h2 class="title">
      <span
        v-for="(word, index) in words"
        :key="`${word}-${index}`"
        :class="{ highlight: word === highlight }"
        :style="wordStyle(index)"
        >{{ word }}</span
      >
    </h2>
    <Transition name="slide">
      <p class="subtitle">{{ subtitle }}</p>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle?: string
  highlight?: string
  tone?: 'calm' | 'alert'
}>()

const tone = computed(() => props.tone || 'calm')

const words = computed(() => {
  if (!props.highlight) return props.title.split(' ').filter(Boolean)
  const regex = new RegExp(`(${props.highlight})`, 'i')
  const chunks = props.title.split(regex)
  return chunks.flatMap((chunk) => {
    if (chunk === props.highlight) return chunk
    return chunk.split(' ').filter(Boolean)
  })
})

const wordStyle = (index: number) => {
  const delay = `${index * 0.1}s`
  return {
    '--delay': delay,
  }
}
</script>

<style lang="scss" scoped>
.wizard-header {
  text-align: center;
  color: $white;
  padding: clamp(0.5rem, 2.2vh, 1rem) 0;

  .title {
    @include text-shadow;

    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: $padding-sm;
    font-size: clamp(1.75rem, 8.5vw, 2.25rem);
    font-weight: 900;
    transform: rotate(-2deg);
    line-height: 1.3;
    text-transform: uppercase;
    --translate-dx: -5rem;

    span {
      animation: wordInCalm 0.36s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
      animation-delay: var(--delay);
      will-change: transform, opacity;
    }

    .highlight {
      color: $yellow-main;
      text-decoration: underline;
      text-decoration-thickness: 4px;
      text-underline-offset: 4px;
      animation:
        wordInCalm 0.36s cubic-bezier(0.2, 0.8, 0.2, 1) backwards,
        highlightPulse 0.45s ease-out forwards;
      animation-delay:
        var(--delay),
        calc(var(--delay) + 0.22s);
    }
  }

  .subtitle {
    margin: $padding-sm 0 0;
    font-size: clamp(0.95rem, 4.4vw, 1.12rem);
    font-weight: 400;
    max-width: 92%;
    margin-left: auto;
    margin-right: auto;
    opacity: 0;
    --translate-dx: 5rem;
    will-change: opacity, translate;
    animation: subtitleInCalm 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    animation-delay: 0.15s;
  }
}

.wizard-header.tone-alert {
  .title {
    span {
      animation: wordInAlert 0.22s cubic-bezier(0.22, 1, 0.35, 1) backwards;
      animation-delay: var(--delay);
    }

    .highlight {
      animation:
        wordInAlert 0.22s cubic-bezier(0.22, 1, 0.35, 1) backwards,
        highlightPulse 0.5s ease-out forwards;
      animation-delay:
        var(--delay),
        calc(var(--delay) + 0.12s);
    }
  }

  .subtitle {
    animation: subtitleInAlert 0.35s cubic-bezier(0.22, 1, 0.35, 1) forwards;
    animation-delay: 0.1s;
  }
}

@keyframes wordInCalm {
  0% {
    opacity: 0;
    transform: translateX(var(--translate-dx)) rotate(-1.2deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotate(0);
  }
}

@keyframes wordInAlert {
  0% {
    opacity: 0;
    transform: translateX(var(--translate-dx)) translateY(-0.1rem) rotate(-1.4deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0);
  }
}

@keyframes subtitleInCalm {
  from {
    opacity: 0;
    translate: var(--translate-dx) 0;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes subtitleInAlert {
  0% {
    opacity: 0;
    transform: translateY(0.25rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes highlightPulse {
  0% {
    filter: drop-shadow(0 0 0 rgba($yellow-main, 0));
  }
  60% {
    filter: drop-shadow(0 0 0.4rem rgba($yellow-main, 0.65));
  }
  100% {
    filter: drop-shadow(0 0 0 rgba($yellow-main, 0));
  }
}

@media (prefers-reduced-motion: reduce) {
  .wizard-header {
    .title span,
    .title .highlight,
    .subtitle {
      animation: none !important;
      opacity: 1;
      transform: none !important;
      translate: 0 0 !important;
      filter: none !important;
    }
  }
}
</style>
