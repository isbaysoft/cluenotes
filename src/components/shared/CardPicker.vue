<template>
  <Transition name="drawer">
    <div data-testid="shared-card-picker" v-if="isOpen" class="card-picker">
      <div class="drawer-handle"></div>
      <div class="drawer-header">
        <div class="header-main">
          <span class="header-hint">{{ resolvedHint }}</span>
        </div>
        <div class="header-actions">
          <button class="btn-close-drawer" @click="$emit('onClose')">Done</button>
        </div>
      </div>

      <div v-if="withNotebook && pickedCardName" class="picked-row">
        <span class="picked-label">Picked:</span>
        <span class="picked-value">{{ pickedCardName }}</span>
      </div>

      <div class="picker-area">
        <div v-if="withNotebook">
          <NotebookGrid :cardType="cardType" :cardSelectMode="true" @onSelectCard="onGridSelect" />
        </div>
        <div v-else class="category-section" v-for="cardType in filteredCardTypes" :key="cardType">
          <h3 :class="['cat-title', cardType]">{{ cardType }}</h3>
          <div class="chips-grid">
            <button :data-testid="`card-chip-${card.id}`" v-for="card in deckStore.cardsByType(cardType)" :key="card.id"
              class="chip" :class="[{ 'is-selected': isSelected(card) }, cardType]" @click="$emit('onSelect', card)">
              {{ card.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div v-if="isOpen" class="picker-backdrop" @click="$emit('onClose')"></div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDeckStore } from '@/stores/deckStore.js'
import { type Card, type CardType, CARD_TYPES } from '@/models/card'
import NotebookGrid from '@/components/game/NotebookTable.vue'

const props = defineProps<{
  isOpen: boolean
  isMultySelect?: boolean
  handSlots?: (Card | null)[]
  cardType?: CardType
  withNotebook?: boolean
  pickedCardName?: string
  hint?: string
}>()

const emit = defineEmits(['onClose', 'onSelect'])

const deckStore = useDeckStore()
const isSelected = (card: Card) => {
  return props.handSlots?.some((slot) => slot?.id === card.id)
}

const filteredCardTypes = computed(() => {
  if (props.cardType) {
    return [props.cardType]
  }
  return CARD_TYPES
})

const selectedCount = computed(() => props.handSlots?.filter(Boolean).length ?? 0)
const resolvedHint = computed(() => {
  if (props.hint) return props.hint
  if (props.isMultySelect) {
    return `You selected ${selectedCount.value} of ${props.handSlots?.length ?? 0}`
  }
  return 'Tap card name. Grid is reference-only.'
})

const onGridSelect = (card: Card) => {
  emit('onSelect', card)
}
</script>

<style lang="scss" scoped>
.card-picker {
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 8px);
  background: #fff;
  background: $top-nav-color;
  z-index: 50;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  margin: 0 4px;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);

  .drawer-handle {
    width: 60px;
    height: 6px;
    background: #eee;
    border-radius: 10px;
    margin: 10px auto 5px;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $white;
    padding: 6px 14px 4px;
    background: $top-nav-color;
    gap: 0.75rem;

    .header-main {
      font-size: 1rem;
      font-weight: 700;
      min-width: 0;

      .header-hint {
        display: block;
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 0.01em;
        opacity: 0.9;
      }
    }

    .header-actions {
      display: inline-flex;
      align-items: center;
    }

    .btn-close-drawer {
      border: none;
      background: $white;
      color: $top-nav-color;
      font-size: 0.7rem;
      border-radius: 16px;
      padding: 4px 14px;
      font-weight: 700;
    }

  }

  .picked-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 8px 14px;
    background: $top-nav-color;

    .picked-label {
      font-size: 0.72rem;
      font-weight: 800;
      color: rgba($white, 0.75);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .picked-value {
      font-size: 0.72rem;
      font-weight: 800;
      color: rgba($white, 0.96);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-radius: 999px;
      padding: 0.2rem 0.5rem;
      background: rgba($white, 0.17);
      border: 1px solid rgba($white, 0.35);
    }
  }

  .picker-area {
    background: $white;

    .category-section {
      padding: $padding;

      .cat-title {
        margin: 0 0 10px 0;
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 1px;

        @include each-card-color using ($type, $color) {
          color: $color;
        }
      }

      .chips-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .chip {
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
          padding: 8px 14px;
          border-radius: 20px;
          font-weight: 700;
          color: #666;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.15s;

          &.is-selected {
            background: #e3f2fd;
            /* Светло-голубой */
            border-color: $blue-bg;
            color: $blue-dark;
            transform: scale(0.95);
            opacity: 0.5;
            /* Визуально "потрачено" из списка */
            text-decoration: line-through;
          }

          @include each-card-color using ($type, $color) {
            color: $color;
          }
        }
      }
    }
  }
}

.picker-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

/* TRANSITIONS */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.4s cubic-bezier(0.3, 1.2, 0.4, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
