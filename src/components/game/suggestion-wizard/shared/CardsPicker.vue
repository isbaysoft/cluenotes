<template>
  <div data-testid="wizzard-cards-picker" class="cards-picker">
    <div data-testid="wizzard-card-slot" v-for="(slot, idx) in slots" :key="slot.cardType" class="card-slot" :class="[
      slot.cardType,
      {
        filled: hasChoice(slot),
        selected: props.selectedCardId === slot.card?.id,
        'final-action': isFinalGuess(slot),
      },
    ]" @click="onClick(slot)" :style="{ '--rotate': rotateAngles[idx] }">
      <Transition name="slide-down">
        <div data-testid="wizzard-card-slot-selected" v-if="slot.card && !isFinalGuess(slot)"
          class="card-content-wrapper" :key="slot.card.id">
          <div v-if="cardOwner(slot.card.id)" class="class-owner">
            <PlayerAvatar :player="cardOwner(slot.card.id)" />
          </div>

          <CardImage :card="slot.card" class="image" />
          <div class="label-overlay">
            <span>{{ slot.card.name }}</span>
          </div>
        </div>
        <div v-else-if="isFinalGuess(slot)" class="final-action-card">
          <CardImage v-if="slot.card" :card="slot.card" class="image" />
          <span class="risk-tag">RISKY</span>
          <span class="action-state" :class="{ active: props.selectedCardId === slot.card?.id }">
            {{ props.selectedCardId === slot.card?.id ? 'Accusation On' : 'Final Guess' }}
          </span>
        </div>
        <div v-else class="empty-slot">
          <div class="title">{{ slot.cardType }}</div>
          <div class="text">?</div>
          <div class="hint">Tap to choose</div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore'
import { CellStatus } from '@/models/cellStatus'
import { type Slot } from '@/models/game'
import CardImage from '@/components/shared/CardImage.vue'

const props = defineProps<{
  slots: Slot[]
  selectedCardId: string | null
}>()

const emit = defineEmits(['onOpenPicker'])

const notebookStore = useNotebookStore()
const settingsStore = useSettingsStore()

const rotateAngles = ['-1deg', '0.5deg', '1.8deg']

const onClick = (slot: Slot): void => {
  emit('onOpenPicker', slot)
}

const isFinalGuess = (slot: Slot) => slot.card?.id === 'final-guess'
const hasChoice = (slot: Slot) => !!slot.card && !isFinalGuess(slot)

const cardOwner = (cardId: string) => {
  return settingsStore.players.find(
    (player) => notebookStore.getStatus(player.id, cardId) === CellStatus.HAS,
  )
}
</script>

<style lang="scss" scoped>
.cards-picker {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  gap: clamp(0.45rem, 1.6vh, 0.75rem);
  width: 100%;
  height: 100%;
  container-type: size;
  padding-bottom: 0.15rem;

  .card-slot {
    --slot-tint: rgba(255, 255, 255, 0.2);
    aspect-ratio: 3/4;
    width: min(46cqw, 35cqh);
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.2s ease;
    border: $border-width dashed rgba($white, 0.9);
    border-radius: $border-radius;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    transform: rotate(var(--rotate));
    cursor: pointer;

    .class-owner {
      width: 1.5rem;
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
    }

    .image {
      width: 100%;
      height: 100%;
    }

    .empty-slot {
      @include flex-center;
      flex-direction: column;
      height: 100%;
      background:
        radial-gradient(circle at 50% 28%, rgba(255, 255, 255, 0.14) 0%, transparent 52%),
        linear-gradient(180deg, var(--slot-tint) 0%, rgba(255, 255, 255, 0.08) 100%);

      .title {
        width: 100%;
        text-align: center;
        color: $white;
        height: 1.5rem;
      }

      .text {
        @include flex-center;
        width: 100%;
        flex: 0 0 auto;
        font-size: 3.2rem;
        color: rgba(255, 255, 255, 0.78);
        font-weight: 900;
        margin-top: auto;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }

      .hint {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.62rem;
        font-weight: 800;
        color: rgba($white, 0.96);
        background: rgba($black, 0.32);
        border: 1px solid rgba($white, 0.5);
        border-radius: 999px;
        padding: 0.22rem 0.5rem;
        margin-top: auto;
        margin-bottom: 0.9rem;
      }
    }

    .final-action-card {
      width: 100%;
      height: 100%;
      position: relative;

      .image {
        width: 100%;
        height: 100%;
      }

      .risk-tag {
        position: absolute;
        top: 0.45rem;
        left: 0.45rem;
        font-size: 0.62rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        padding: 0.2rem 0.35rem;
        border-radius: 999px;
        background: rgba(#ff7043, 0.95);
        color: $white;
      }

      .action-state {
        position: absolute;
        bottom: 0.45rem;
        left: 50%;
        transform: translateX(-50%) rotate(-6deg);
        font-size: 0.8rem;
        font-weight: 900;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 0.3rem 0.7rem;
        border-radius: 0.25rem;
        background: rgba($black, 0.7);
        color: $white;
        white-space: nowrap;

        &.active {
          background: #d32f2f;
          box-shadow: 0 0 0 3px rgba(#ff8a80, 0.4);
        }
      }
    }

    .label-overlay {
      position: absolute;
      bottom: 1rem;
      left: -10%;
      width: 120%;
      background-color: #ffffff;
      transform: rotate(-7deg);
      padding: $padding-sm 0;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
      text-align: center;
      box-sizing: border-box;
      transition: all 0.2s;

      span {
        display: block;
        font-size: 0.7rem;
        font-weight: 900;
        color: $white;
        text-transform: uppercase;
        letter-spacing: 1px;
        transform: rotate(0deg);
        padding: 0 1rem;
      }
    }

    @include each-card-color using ($type, $color) {
      .title {
        background: $color;
      }

      .label-overlay {
        background-color: $color;
      }

      --slot-tint: color-mix(in srgb, #{$color} 36%, transparent);
    }

    &.special {
      .label-overlay {
        background-color: $orange-accent;
      }
    }

    &.filled {
      border-style: solid;
      border-color: rgba($white, 0.98);
    }

    &.selected {
      transform: rotate(var(--rotate)) scale(1.015);

      .label-overlay {
        box-shadow: 0 -0.6rem 0px $yellow-main;
      }
    }

    &.final-action {
      border-style: solid;
      border-color: rgba($white, 0.95);

      &.selected {
        border-color: #ff8a80;
        box-shadow:
          0 0 0 3px rgba(#ff8a80, 0.35),
          0 0 1.2rem rgba(#ff5252, 0.35);
      }
    }
  }
}

.card-content-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.slide-down-enter-active {
  transition: transform 0.2s ease-in;
}

.slide-down-enter-from {
  transform: translateY(-100%);
}

.slide-down-enter-to {
  transform: translateY(0);
}

@media (max-height: 760px) {
  .cards-picker {
    gap: 0.45rem;

    .card-slot {
      width: min(47cqw, 36cqh);
    }
  }
}
</style>
