<template>
  <div class="application-view" :class="{ 'has-active-game': settingsStore.hasActiveGame }">
    <div class="logo-img">
      <img data-testid="logo-img" src="@/assets/main.webp" />
    </div>

    <div class="logo">
      <LogoArea data-testid="logo-area" subtitle="Don't have a Clue? Now you do!" />
    </div>

    <div class="menu-stack">
      <div data-testid="active-game-ticket" v-if="settingsStore.hasActiveGame" class="ticket" @click="resumeGame">
        <div class="ticket-rip"></div>
        <div class="ticket-content">
          <span class="status-label">
            <span v-if="settingsStore.finalSuggestion"> GAME COMPLETED! </span>
            <span v-else>GAME IN PROGRESS</span>
          </span>
          <div class="game-info">
            <span class="turn">Turn #{{ settingsStore.suggestions.length }}</span>
            <span class="players">{{ settingsStore.playerCount }} Players</span>
          </div>
          <button data-testid="resume-game-button" class="btn-arrow" @click="resumeGame">
            Resume <icon-material-symbols-arrow-right-alt-rounded />
          </button>
        </div>
      </div>

      <div class="actions">
        <Button data-testid="new-game-button" class="button primary" @click="initNewGame(false)">New Game</Button>
      </div>

      <footer class="site-footer">
        <p>© {{ new Date().getFullYear() }} Unofficial Clue Notes</p>
        <nav>
          <RouterLink data-testid="terms-link" to="/terms">Terms & Privacy</RouterLink>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'
import LogoArea from '@/components/shared/LogoArea.vue'
import Button from '@/components/shared/Button.vue'
import { modalService } from '@/services/modal/service'

const router = useRouter()
const settingsStore = useSettingsStore()
const resumeGame = () => router.push({ name: 'game-play' })

const initNewGame = (force: boolean) => {
  if (!force && settingsStore.hasActiveGame) {
    askAboutNewGameModal()
    return
  }
  settingsStore.initNewGame()
  router.push('/game/players')
}

const askAboutNewGameModal = async () => {
  const confirmed = await modalService.open({
    type: 'confirmation',
    title: 'Start a New Game?',
    body: 'Are you sure you want to start a new game? Your current progress will be lost.',
  })

  if (confirmed) {
    initNewGame(true)
  }
}
</script>

<style lang="scss" scoped>
.application-view {
  container-type: size;

  .site-footer {
    margin-top: auto;
    /* Притискає футер до низу */
    padding: 12px 20px 14px;
    text-align: center;
    font-size: 0.76rem;
    color: $white;

    a {
      text-decoration: underline;
      cursor: pointer;
      color: $white;
    }
  }

  height: 100dvh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  background: radial-gradient(circle at center, $blue-bg 0%, $blue-dark 100%);

  .logo-img {
    flex: 1;
    min-height: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      transform-origin: top center;
      will-change: transform;
      animation: gentle-swing 3s ease-in-out infinite alternate;
      width: 68%;
      max-width: 20rem;
      height: auto;
      max-height: 100%;
      object-fit: contain;
      border-radius: 10px;
      box-shadow: none;
      position: relative;
      margin: $padding 0 $padding-sm;
    }
  }

  .logo {
    margin-top: 0;
  }

  .ticket {
    @include shadow;

    opacity: 0;
    will-change: opacity, transform;
    animation: bounce-in 1s forwards;

    background: $white;
    color: $blue-dark;
    border-radius: $border-radius;
    position: relative;
    overflow: hidden;
    transform: rotate(2deg);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: rotate(0deg) scale(1.02);
    }

    .ticket-content {
      padding: 0.8rem 1rem;
      display: flex;
      flex-direction: column;
      border: 0.17rem dashed #ddd;
      margin: 0.3rem;
      border-radius: $border-radius;
    }

    .status-label {
      font-size: 0.7rem;
      font-weight: 900;
      color: $green;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
    }

    .game-info {
      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      font-weight: 900;
      margin: $padding-sm 0 $padding;
    }

    .btn-arrow {
      @include flex-center(0.5rem);

      background: $blue-bg;
      font-size: 1rem;
      color: white;
      border: none;
      padding: $padding-sm;
      border-radius: $border-radius;
      font-weight: 700;
      text-align: center;
      cursor: pointer;
    }
  }

  .menu-stack {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: $padding;
    box-sizing: border-box;
  }
}

.application-view.has-active-game {
  .logo-img {
    img {
      width: 60%;
      max-width: 16rem;
      margin: $padding-sm 0;
    }
  }

  .menu-stack {
    gap: 0.85rem;
    padding-top: $padding-sm;
  }

  .ticket {
    .ticket-content {
      padding: 0.65rem 0.85rem;
    }

    .game-info {
      margin: 0.35rem 0 0.6rem;
      font-size: 1.05rem;
    }
  }

  .site-footer {
    padding-top: 8px;
  }
}

.actions {
  display: flex;
  justify-content: center;
}

.secondary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $padding;

  .btn-full {
    grid-column: span 2;
  }
}

@media (min-width: 700px) {
  .application-view {
    .logo-img {
      flex: 0 0 auto;
      padding-top: 0.9rem;

      img {
        width: 56%;
        max-width: 15rem;
        margin: 0.9rem 0 0.5rem;
      }
    }

    .menu-stack {
      gap: 0.9rem;
      padding-top: 0.4rem;
    }
  }

  .application-view.has-active-game {
    .logo-img {
      img {
        width: 50%;
        max-width: 13rem;
      }
    }
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  50% {
    transform: scale(1.1) rotate(2deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(2deg);
  }
}
</style>
