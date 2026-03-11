<template>
  <div v-if="winner" data-testid="winner" class="accusation-confirmed">
    <div class="ticket">
      <div class="ticket-inner">
        <div class="winner-header">
          <div class="avatar">
            <PlayerAvatar :player="winner" />
          </div>
          <h2 class="header-text">
            CASE CLOSED!
          </h2>
          <span class="header-subtext">{{ winner.name }} won the game</span>
        </div>

        <div class="divider" />

        <div v-if="settingsStore.finalSuggestion" class="cards-container">
          <div v-for="cardType in CARD_TYPES" :key="cardType" class="solution-card">
            <CardImage :card="settingsStore.finalSuggestion[cardType]" class="card-image" />
          </div>
        </div>
        <div class="actions">
          <Button class="button primary" @click="exitGame">
            Start New Game
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useRouter } from 'vue-router'
import { CARD_TYPES } from '@/models/card'
import CardImage from '@/components/shared/CardImage.vue'
import Button from '@/components/shared/Button.vue'

const settingsStore = useSettingsStore()
const router = useRouter()

const winner = computed(() => {
  if (!settingsStore.finalSuggestion) return

  return settingsStore.findPlayerById(settingsStore.finalSuggestion.askedByPlayerId)
})

const exitGame = () => {
  return router.push('/')
}
</script>

<style lang="scss" scoped>
.accusation-confirmed {
  display: flex;
  width: 100%;
  padding: $padding;
  box-sizing: border-box;
  background-image: url('../../assets/bg1.webp');

  .ticket {
    position: relative;
    transform-origin: top center;
    will-change: transform;
    animation: gentle-swing 3s ease-in-out infinite alternate;

    &:before {
      content: '';
      opacity: 0.95;
      background: $white;
      border-radius: $border-radius;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      z-index: -1;
    }

    .ticket-inner {
      padding: 1rem 1rem;
      display: flex;
      flex-direction: column;
      border: 0.17rem dashed #ddd;
      margin: 0.3rem;
      border-radius: $border-radius;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    padding: $padding 0 0;
  }

  .winner-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .header-text {
      margin: 0;
      font-size: 2rem;
      color: red;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 2px solid red;
      padding: 1rem;
      rotate: -4deg;
    }

    .header-subtext {
      margin: 4px 0 0;
      color: #7f8c8d;
      font-size: 16px;
    }
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .divider {
    height: 1px;
    background-color: #eee;
    width: 100%;
    margin: $padding 0;
  }

  .cards-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $padding;

    .solution-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      .card-image {
        width: 100%;
      }
    }
  }
}
</style>
