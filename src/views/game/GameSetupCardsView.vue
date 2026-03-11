<template>
  <div data-testid="game-setup-cards-view" class="game-setup-cards-view">
    <Transition name="zoom">
      <div data-testid="big-card-image-modal" v-if="currentCard" class="big-card-image-modal" @click="showIndex = null">
        <CardImage :card="currentCard" />
      </div>
    </Transition>

    <BackButton v-if="!isEditing" routeName="game-players" />
    <LogoArea subtitle="Select the cards you hold" />

    <div class="hand-area">
      <span class="status-tag">Your hand</span>
      <div class="hand-status">
        <div class="status-row">
          <span class="status-main">{{ selectedCount }}</span>
          <span class="status-tail">
            <span class="status-slash">/</span>
            <span class="status-min">{{ minHandSize }}</span>
            <span>required</span>
          </span>
          <span v-if="extraCardsSize" class="status-extra">
            <span class="status-plus">+</span>
            <span class="status-extra-num">{{ extraCardsSize }}</span>
            <span>extra</span>
          </span>
        </div>
      </div>
      <div class="slots-container" :style="gridConfig">
        <TransitionGroup name="deal">
          <div data-testid="card-slot" v-for="(card, index) in handSlots" :key="index" class="card-slot"
            :class="{ filled: card, empty: !card }" :style="!card ? emptySlotChaos(index) : undefined"
            @click="pickCard(index)">
            <div v-if="card" class="card-content" :class="card.type">
              <CardImage :card="card" class="card-image" :class="{ show: showIndex === index }" />
              <button data-testid="remove-card-button" class="btn-mini right" @click.stop="removeCard(index)">
                <icon-material-symbols-delete-outline />
              </button>
              <button data-testid="show-card-button" class="btn-mini left" @click.stop="showCard(index)">
                <icon-hugeicons-view />
              </button>
              <div class="label-overlay">
                <span>{{ card.name }}</span>
              </div>
            </div>
            <div v-else class="empty-placeholder">
              <div class="ghost-icon">{{ index < minHandSize ? '?' : '+' }}</div>
                  <span class="slot-label">
                    <template v-if="index < minHandSize">
                      <span>Tap to</span>
                      <span>choose</span>
                    </template>
                    <template v-else>
                      <span>Optional</span>
                      <span>extra</span>
                    </template>
                  </span>
              </div>
            </div>
        </TransitionGroup>
      </div>
    </div>

    <CardPicker :isOpen="isPickerOpen" :handSlots="handSlots" :isMultySelect="isPickerIndex === null"
      hint="Tap card name to add or remove it from your hand." @onSelect="toggleCard" @onClose="resetPicker" />

    <div class="footer-action">
      <Button data-testid="cards-continue-button" class="primary" @click="save" :caption="buttonText" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LogoArea from '@/components/shared/LogoArea.vue'
import BackButton from '@/components/shared/BackButton.vue'
import CardPicker from '@/components/shared/CardPicker.vue'
import Button from '@/components/shared/Button.vue'
import CardImage from '@/components/shared/CardImage.vue'

import { ref, computed, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { type Card } from '@/models/card'
import { useNotebookStore } from '@/stores/notebookStore'
import { useSettingsStore } from '@/stores/settingsStore.js'

const router = useRouter()
const route = useRoute()
const notebookStore = useNotebookStore()
const settingsStore = useSettingsStore()

const cardsToDeal = 18
const isPickerIndex = ref<number | null>(null)
const showIndex = ref<number | null>(null)
const isPickerOpen = ref(false)
const handSlots = ref<(Card | null)[]>([])

// --- Computed ---
const isEditing = computed(() => route.query.edit)
const isHandFull = computed(() => handSlots.value.filter(Boolean).length >= minHandSize.value)
const selectedCount = computed(() => handSlots.value.filter(Boolean).length)
const minHandSize = computed(() => Math.floor(cardsToDeal / settingsStore.playerCount))
const maxHandSize = computed(() => minHandSize.value + extraCardsSize.value)
const extraCardsSize = computed(() => cardsToDeal % settingsStore.playerCount)

const emptySlotChaos = (index: number) => {
  const rotates = ['-1.1deg', '0.9deg', '-0.7deg', '1.2deg', '-0.5deg', '0.8deg']
  const shiftX = ['-2px', '2px', '-1px', '3px', '-2px', '1px']
  const shiftY = ['0px', '-1px', '1px', '-2px', '1px', '-1px']
  return {
    '--slot-rotate': rotates[index % rotates.length],
    '--slot-shift-x': shiftX[index % shiftX.length],
    '--slot-shift-y': shiftY[index % shiftY.length],
  }
}

const currentCard = computed(() => showIndex.value !== null ? handSlots.value[showIndex.value] : null)

const buttonText = computed(() => {
  return isHandFull.value ? (isEditing.value ? 'Save' : 'Start game') : 'Quick fill'
})

const gridConfig = computed(() => {
  const n = isEditing.value ? handSlots.value.length : maxHandSize.value
  let cols = 1

  if (n === 1) cols = 1
  else if (n <= 4) cols = 2
  else if (n <= 9) cols = 3
  else cols = 4

  const rows = Math.ceil(n / cols)

  return {
    '--cols': cols,
    '--rows': rows,
  }
})

onBeforeMount(() => {
  if (isEditing.value) {
    handSlots.value = notebookStore.myCards as Card[]
  } else {
    handSlots.value = new Array(maxHandSize.value).fill(null)
  }
})

const showCard = (index: number) => {
  showIndex.value = index
}

const pickCard = (index: number) => {
  isPickerOpen.value = true
  isPickerIndex.value = index
}

const toggleCard = (card: Card) => {
  let idx = handSlots.value.findIndex((slot) => slot?.id === card.id)
  if (idx !== -1) {
    handSlots.value[idx] = null
  } else {
    const emptyIndex = handSlots.value.findIndex((slot) => slot === null)
    idx = isPickerIndex.value || emptyIndex
    handSlots.value[isPickerIndex.value || emptyIndex] = card
  }
  if (isHandFull.value || isPickerIndex.value !== null) {
    resetPicker()
  }
}

const removeCard = (index: number) => {
  handSlots.value[index] = null
}

const resetPicker = () => {
  isPickerOpen.value = false
  isPickerIndex.value = null
}

const save = () => {
  if (isHandFull.value) {
    const cardIds = handSlots.value.flatMap((card) => card ? [card.id] : [])
    notebookStore.setMyCards(cardIds)
    if (!isEditing.value) {
      settingsStore.startNewGame()
    }
    router.push({ name: 'game-play' })
  } else {
    isPickerOpen.value = true
  }
}
</script>

<style lang="scss" scoped>
.game-setup-cards-view {
  @include fullpage;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 14% 12%, rgba($white, 0.16) 0%, transparent 36%),
      radial-gradient(circle at 86% 84%, rgba($yellow-main, 0.1) 0%, transparent 34%);
  }

  .hand-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding-top: 0.2rem;
    align-items: center;

    .status-tag {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border: 1px solid rgba($white, 0.4);
      border-radius: 999px;
      padding: 0.14rem 0.52rem;
      color: rgba($white, 0.95);
      background: rgba(0, 0, 0, 0.12);
      margin-bottom: 0.4rem;
    }
  }
}

.hand-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 0 1rem 0.55rem;
  flex-wrap: wrap;

  .status-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.28rem;
    align-items: flex-end;
    justify-content: center;
  }

  .status-main {
    font-size: 1.28rem;
    line-height: 0.92;
    font-weight: 900;
    color: $yellow-main;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  }

  .status-tail {
    display: flex;
    align-items: flex-end;
    gap: 0.18rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: rgba($white, 0.95);
    line-height: 0.96;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);

    .status-min {
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
  }

  .status-extra {
    display: flex;
    align-items: flex-end;
    gap: 0.18rem;
    font-size: 0.74rem;
    font-weight: 700;
    color: rgba($yellow-main, 0.95);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 0.96;

    .status-extra-num {
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
  }
}

.slots-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  --gap: 10px;
  gap: var(--gap);
}

.card-slot {
  --avail-w: calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols));
  --avail-h: calc((100% - (var(--rows) - 1) * var(--gap)) / var(--rows));
  aspect-ratio: 3 / 4;
  width: var(--avail-w);
  max-width: calc(var(--avail-h) * (3 / 4));
  max-height: var(--avail-h);
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(160deg, rgba($white, 0.14), rgba($white, 0.03)),
    rgba(0, 0, 0, 0.15);
  border: $border-width dashed rgba($white, 0.48);
  border-radius: $border-radius;
  box-sizing: border-box;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  transform: translate(var(--slot-shift-x, 0), var(--slot-shift-y, 0)) rotate(var(--slot-rotate, 0deg));
  box-shadow:
    inset 0 0 0 1px rgba($white, 0.1),
    0 8px 18px rgba(0, 0, 0, 0.18);

  &:hover {
    transform: translate(var(--slot-shift-x, 0),
        calc(var(--slot-shift-y, 0px) - 1px)) rotate(var(--slot-rotate, 0deg));
    border-color: rgba($white, 0.75);
    background:
      linear-gradient(160deg, rgba($white, 0.2), rgba($white, 0.06)),
      rgba(0, 0, 0, 0.1);
  }

  &.empty {
    .empty-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      text-align: center;

      .ghost-icon {
        font-size: clamp(2.4rem, 8cqw, 4rem);
        color: rgba($white, 0.35);
        font-weight: 900;
        line-height: 1;
      }

      .slot-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: clamp(0.72rem, 2.1cqw, 0.98rem);
        font-weight: 800;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        line-height: 1.06;
        color: rgba($white, 0.72);
      }
    }
  }

  &.filled {
    border: none;

    .card-content {
      @include shadow;
      background: white;
      transform: rotate(-2deg);
      box-shadow:
        0 12px 22px rgba(0, 0, 0, 0.22),
        inset 0 0 0 1px rgba($white, 0.35);
    }

    &:nth-child(even) {
      .card-content {
        transform: rotate(2deg);
      }
    }
  }

  .card-content {
    width: 100%;
    height: 100%;
    padding: $padding-sm;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: $border-radius;
    overflow: hidden;
    position: relative;
    color: #333;
    overflow-wrap: anywhere;

    .card-icon {
      font-size: 1.5rem;
    }

    .card-image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .card-name {
      font-size: 0.8rem;
      font-weight: 700;
      line-height: 1.1;
    }

    .btn-mini {
      position: absolute;
      top: 2px;
      color: white;
      border: $border-width solid $white;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      font-size: 0.7rem;
      padding: 0;
      cursor: pointer;
      display: grid;
      place-content: center;

      &.left {
        left: 2px;
        background: $green;
      }

      &.right {
        right: 2px;
        background: $red;
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

      span {
        display: block;
        font-size: 0.6rem;
        font-weight: 900;
        color: $white;
        text-transform: uppercase;
        letter-spacing: 1px;
        transform: rotate(0deg);
        padding: 0 1rem;
      }
    }

    @include each-card-color using ($type, $color) {
      .label-overlay {
        background-color: $color;
      }
    }
  }
}

.big-card-image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out;

  img {
    width: 95%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
}

.footer-action {
  padding: $padding;
  padding-top: 0.75rem;

  .button {
    width: 100%;
  }
}

.deal-enter-active,
.deal-leave-active {
  transition: all 0.3s ease;
}

.deal-enter-from {
  opacity: 0;
  transform: translateY(-30px) rotate(10deg);
}

.deal-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.5);
  /* Картинка вылетает из маленького размера */
}
</style>
