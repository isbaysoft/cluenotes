<template>
  <div class="game-menu">
    <div class="menu-header">
      <h2 class="menu-title">
        PAUSED
      </h2>
      <p class="menu-subtitle">
        Game is safely on hold
      </p>
    </div>

    <div class="menu-actions">
      <Button
        class="secondary menu-btn icon-btn w-wide tilt-left"
        @click="editPlayers"
      >
        <span class="btn-content">
          <icon-icons8-spy class="btn-icon" />
          <span class="btn-label">Players</span>
          <span
            class="icon-spacer"
            aria-hidden="true"
          />
        </span>
      </Button>

      <Button
        class="secondary menu-btn icon-btn w-mid tilt-right"
        @click="editHand"
      >
        <span class="btn-content">
          <icon-hugeicons-view class="btn-icon" />
          <span class="btn-label">My Hand</span>
          <span
            class="icon-spacer"
            aria-hidden="true"
          />
        </span>
      </Button>

      <Button
        class="secondary menu-btn icon-btn w-narrow tilt-left"
        @click="viewHistory"
      >
        <span class="btn-content">
          <icon-ic-sharp-manage-search class="btn-icon" />
          <span class="btn-label">History</span>
          <span
            class="icon-spacer"
            aria-hidden="true"
          />
        </span>
      </Button>

      <Button
        class="secondary menu-btn warning icon-btn w-mid tilt-right"
        @click="resetClues"
      >
        <span class="btn-content">
          <icon-material-symbols-warning-rounded class="btn-icon" />
          <span class="btn-label">Reset clues</span>
          <span
            class="icon-spacer"
            aria-hidden="true"
          />
        </span>
      </Button>

      <Button
        class="secondary menu-btn danger icon-btn w-narrow tilt-left"
        @click="quitGame"
      >
        <span class="btn-content">
          <icon-material-symbols-door-open-rounded class="btn-icon" />
          <span class="btn-label">Exit Game</span>
          <span
            class="icon-spacer"
            aria-hidden="true"
          />
        </span>
      </Button>
    </div>

    <div class="menu-resume">
      <Button
        class="primary menu-btn resume icon-btn"
        @click="$emit('onClose')"
      >
        <span class="btn-content">
          <icon-mdi-play class="btn-icon resume-icon" />
          <span class="btn-label">Resume</span>
          <span
            class="icon-spacer"
            aria-hidden="true"
          />
        </span>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useNotebookStore } from '@/stores/notebookStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { modalService } from '@/services/modal/service'
import Button from '@/components/shared/Button.vue'

const emit = defineEmits(['onClose'])
const notebookStore = useNotebookStore()
const settingsStore = useSettingsStore()
const router = useRouter()

const resetClues = async () => {
  const confirmed = await modalService.open({
    type: 'confirmation',
    title: 'Reset All Clues',
    body: 'Are you sure you want to reset all clues? This action cannot be undone.',
    confirmButtonText: 'Reset Clues',
  })

  if (!confirmed) {
    return
  }

  notebookStore.resetManualOverrides()
  settingsStore.resetSuggestions()
  setTimeout(() => {
    emit('onClose')
  }, 300)
}

const editPlayers = () => {
  router.push({ name: 'game-players', query: { edit: 'true' } })
  emit('onClose')
}

const editHand = () => {
  router.push({ name: 'setup-cards', query: { edit: 'true' } })
  emit('onClose')
}

const viewHistory = () => {
  router.push({ name: 'log' })
}

const quitGame = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.game-menu {
  @include fullpage;
  background: radial-gradient(circle at center, $blue-bg 0%, $blue-dark 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: clamp(1rem, 4vh, 2rem) 1rem calc(1rem + env(safe-area-inset-bottom));

  .menu-header {
    text-align: center;
    margin-top: clamp(0.4rem, 4vh, 2.2rem);
  }

  .menu-title {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    letter-spacing: 0.08rem;
  }

  .menu-subtitle {
    margin-top: 0.25rem;
    font-size: 0.9rem;
    opacity: 0.86;
  }

  .menu-actions {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    width: min(100%, 24rem);

    .action-hint {
      margin-top: -0.3rem;
      margin-bottom: 0.2rem;
      text-align: center;
      font-size: 0.74rem;
      opacity: 0.8;
    }

    .menu-btn {
      align-self: center;
      box-shadow:
        inset 0 2px 2px rgba(255, 255, 255, 0.35),
        inset 0 -2px 2px rgba(0, 0, 0, 0.2),
        0 4px 0 rgba(0, 0, 0, 0.25),
        0 6px 10px rgba(0, 0, 0, 0.28);
    }

    .icon-btn {
      .btn-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .btn-icon {
        justify-self: center;
        font-size: 1.2em;
        line-height: 1;
      }

      .btn-label {
        justify-self: center;
        text-align: center;
      }

      .icon-spacer {
        width: 1.35rem;
        height: 1px;
      }
    }

    .w-wide {
      min-width: 84%;
    }

    .w-mid {
      min-width: 64%;
    }

    .w-narrow {
      min-width: 58%;
    }

    .tilt-left {
      transform: rotate(-1.4deg) translateX(-7px);
    }

    .tilt-right {
      transform: rotate(1.1deg) translateX(7px);
    }

    .tilt-left-soft {
      transform: rotate(-0.45deg) translateX(-3px);
    }

    .tilt-right-soft {
      transform: rotate(0.45deg) translateX(3px);
    }

    .menu-btn.warning {
      background: linear-gradient(to bottom, #f4a93f 0%, #c67b1d 100%);
      border-color: #9a5f15;
    }

    .menu-btn.danger {
      background: linear-gradient(to bottom, #e66d6d 0%, #b73939 100%);
      border-color: #8f2727;
    }
  }

  .menu-resume {
    width: min(100%, 24rem);
    display: flex;
    justify-content: center;
    margin-left: 5rem;

    .btn-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .menu-btn.resume {
      transform: rotate(1deg) translateX(6px);
    }
  }
}

@media (max-height: 760px) {
  .game-menu {
    .menu-actions {
      gap: 0.55rem;

      .action-hint {
        margin-top: -0.2rem;
        margin-bottom: 0.05rem;
      }
    }

    .menu-resume {
      margin-top: 0.35rem;
    }
  }
}
</style>
