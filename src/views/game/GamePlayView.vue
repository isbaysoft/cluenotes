<template>
  <div class="game-play-view">
    <Flyout :show="isShowSettingsModal">
      <GameMenu @onClose="isShowSettingsModal = false" />
    </Flyout>

    <SuggestionWizard v-if="isShowSuggestionModal" @onClose="isShowSuggestionModal = false" />

    <div class="game-body">
      <div class="grid-scroll-area">
        <NotebookGrid :hideCards="hideCards" :autoHideProgress="autoHideCardsPercent"
          :style="`--autoHideProgress: ${autoHideCardsPercent}%`">
          <template v-slot:corner>
            <div data-testid="game-menu-container" class="game-menu">
              <button data-testid="game-menu-button" class="button-settings" @click="isShowSettingsModal = true">
                <icon-ic-sharp-settings />
              </button>

              <button class="button-settings" @click="$router.push('/game/log')">
                <icon-solar-hamburger-menu-bold />
              </button>

              <button v-if="deviceOrientationAllowed" class="button-settings" :class="{ active: autoHideCards }"
                @click="requestMotionPermission">
                <icon-mdi-hide-outline class="fab-icon" v-if="!autoHideCards" />
                <icon-mdi-show-outline class="fab-icon" v-else />
              </button>

              <button class="button-settings" @click="notebookStore.undo" :disabled="!notebookStore.undoStack.length">
                <icon-ooui-undo-ltr />
              </button>
              <button class="button-settings" @click="notebookStore.redo" :disabled="!notebookStore.redoStack.length">
                <icon-ooui-redo-ltr />
              </button>
            </div>
          </template>
        </NotebookGrid>
      </div>
      <div v-if="hideCards" class="hide-cards-container" :class="{ 'is-holding': isHolding }" @mousedown="startHold"
        @touchstart.prevent="startHold" @mouseup="cancelHold" @mouseleave="cancelHold" @touchend="cancelHold"
        @contextmenu.prevent>
        <div class="hide-cards-lock-icon">
          <icon-mdi-hide-outline />
        </div>
        <icon-fluent-emoji-flat-eyes v-for="eye in eyes" :key="eye.id" class="eyes"
          :style="{ top: eye.y + '%', left: eye.x + '%', '--size': eye.size + 'px' }" />
        <span>Case Files Encrypted</span>
        <span class="subtext">Tap and hold to reveal</span>
      </div>
    </div>
    <button data-testid="suggestion-wizard-button" v-if="!settingsStore.finalSuggestion" class="float-button right"
      @click="showWizzard">
      <icon-solar-pen-new-square-bold class="fab-icon" />
    </button>

    <button v-if="!settingsStore.finalSuggestion && !hideCards" class="float-button left" :class="{ hidden: hideCards }"
      @click="hideYourClues">
      <div class="progress-bar" :class="{ active: permissionGranted }" role="progressbar" aria-valuenow="75"
        aria-valuemin="0" aria-valuemax="100" :style="`--progress: ${autoHideCardsPercent}%`">
        <icon-mdi-hide-outline class="fab-icon" v-if="!hideCards" />
        <icon-ic-outline-hide-image class="fab-icon" v-else />
      </div>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore'
import { modalService } from '@/services/modal/service'
import { toastService } from '@/services/toast/service'
import Flyout from '@/components/shared/Flyout.vue'
import SuggestionWizard from '@/components/game/SuggestionWizard.vue'
import GameMenu from '@/components/shared/GameMenu.vue'
import NotebookGrid from '@/components/game/NotebookTable.vue'

const isShowSuggestionModal = ref(false)
const isShowSettingsModal = ref(false)
const settingsStore = useSettingsStore()
const notebookStore = useNotebookStore()
const hideCards = ref(false)
const autoHideCards = ref(false)
const autoHideCardsPercent = ref(100)
const permissionGranted = ref(false)
const tiltAngle = ref(0)
type Eye = {
  id: string
  x: number
  y: number
  size: number
}
const eyes = ref<Eye[]>([])
const spawnInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isHolding = ref(false)

let hidingTimer: ReturnType<typeof setTimeout> | null = null

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

const orientationEventApi = DeviceOrientationEvent as DeviceOrientationEventWithPermission

const deviceOrientationAllowed =
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof orientationEventApi.requestPermission === 'function'

const handleOrientation = (event: DeviceOrientationEvent) => {
  if (!autoHideCards.value) return

  const beta = event.beta
  if (beta === null) return

  tiltAngle.value = Math.round(beta)

  const current = tiltAngle.value
  const startShow = 30
  const fullShow = 50
  if (current <= startShow) {
    autoHideCardsPercent.value = 0
    return
  }
  if (current >= fullShow) {
    autoHideCardsPercent.value = 100
    return
  }
  autoHideCardsPercent.value = Math.round(((current - startShow) / (fullShow - startShow)) * 100)
}

const requestMotionPermission = async () => {
  if (permissionGranted.value) {
    autoHideCards.value = !autoHideCards.value
    if (!autoHideCards.value) {
      autoHideCardsPercent.value = 100
    }
    return
  }
  if (deviceOrientationAllowed) {
    const confirmed = await modalService.open({
      type: 'confirmation',
      title: 'Enable Tilt Control',
      body: 'Please allow access to motion sensors to hide cards by tilting your device. Confirm next request in the system dialog',
      confirmButtonText: 'Continue',
    })

    if (!confirmed) return

    try {
      const response = await orientationEventApi.requestPermission?.()
      if (response === 'granted') {
        permissionGranted.value = true
        autoHideCards.value = true
        window.addEventListener('deviceorientation', handleOrientation)
      } else {
        alert('Permission declined')
      }
    } catch (error) {
      console.error(error)
    }
  } else {
    permissionGranted.value = true
    window.addEventListener('deviceorientation', handleOrientation)
  }
}

onUnmounted(() => {
  window.removeEventListener('deviceorientation', handleOrientation)
})

const showWizzard = () => {
  isShowSuggestionModal.value = true
  toastService.closeAll()
}

const startHold = () => {
  if (!hideCards.value) {
    toggleHideCards()
    return
  }

  isHolding.value = true

  hidingTimer = setTimeout(() => {
    toggleHideCards()
  }, 600)
}

const cancelHold = () => {
  isHolding.value = false
  if (hidingTimer) {
    clearTimeout(hidingTimer)
    hidingTimer = null
  }
}

const toggleHideCards = () => {
  isHolding.value = false
  if (navigator.vibrate) navigator.vibrate(200)
  const willHide = !hideCards.value
  hideCards.value = willHide

  if (spawnInterval.value) {
    clearInterval(spawnInterval.value)
    spawnInterval.value = null
  }

  if (hideCards.value) {
    spawnInterval.value = setInterval(spawnEye, 800)
  } else {
    eyes.value = []
  }
}

const hideYourClues = () => {
  if (spawnInterval.value) {
    clearInterval(spawnInterval.value)
  }
  hideCards.value = true
  spawnInterval.value = setInterval(spawnEye, 800)
}

const spawnEye = () => {
  const newEye = {
    id: Math.random().toString(36),
    x: Math.random() * 90,
    y: Math.random() * 90,
    size: Math.random() * 60 + 20,
  }

  eyes.value.push(newEye)

  setTimeout(() => {
    eyes.value = eyes.value.filter((e) => e.id !== newEye.id)
  }, 3000)
}
</script>

<style lang="scss" scoped>
.game-play-view {
  height: 100dvh;
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  .game-body {
    background: $white;
    overflow-y: auto;

    .hide-cards-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      background-color: rgba(#000, 0.7);
      color: $white;

      .hide-cards-lock-icon {
        padding: $padding;
        position: relative;
        border-radius: $border-radius;
        overflow: hidden;
        display: grid;
        place-items: center;

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          transform: translateY(100%);
          transition: transform 0.6s ease-in-out;
          width: 100%;
          height: 100%;
          background: rgba($white, 0.5);
        }
      }

      &.is-holding {
        .hide-cards-lock-icon {
          &:before {
            transform: translateY(0);
          }
        }
      }

      .subtext {
        font-size: 0.9rem;
      }

      .eyes {
        position: absolute;
        width: var(--size);
        height: var(--size);
        display: flex;
        justify-content: space-between;
        opacity: 0;
        animation: blink 3s ease-in-out forwards;
      }
    }
  }

  .float-button {
    position: fixed;
    bottom: 1rem;
    z-index: 1;

    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    border: 5px solid $white;

    background-color: $green;
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    transition:
      transform 0.2s,
      box-shadow 0.2s,
      background-color 0.2s;

    &:hover {
      background-color: $dark-green;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0) scale(0.95);
      /* Кнопка трохи втискається */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    &.right {
      right: 50%;
      translate: calc((min(100vw, $max-width-app) - 2rem) / 2);
    }

    &.left {
      left: 50%;
      translate: calc((min(100vw, $max-width-app) - 2rem) / -2);
      background-color: $red;

      &.hidden {
        background-color: $green;
      }

      .progress-bar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2em;
        position: absolute;

        &.active {
          color: blue;
          background:
            radial-gradient(closest-side, white 79%, transparent 80% 100%),
            conic-gradient($red var(--progress, 0), $green 0);
        }
      }
    }

    .fab-icon {
      width: 24px;
      height: 24px;
    }
  }
}

.game-menu {
  display: flex;
  justify-content: space-around;
  color: $white;

  .button-settings {
    color: $white;
    width: 42px;
    height: 42px;
    background: none;
    border: none;
    border-radius: $border-radius;
    font-size: 1.2rem;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      background: rgba($white, 0.2);
    }

    &:disabled {
      opacity: 0.4;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  20% {
    opacity: 1;
    transform: scale(1);
  }

  80% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>
