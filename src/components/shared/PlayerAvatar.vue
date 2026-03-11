<template>
  <div class="player-avatar" :style="{ '--bg': player.color }">
    <icon-icons8-spy v-if="settingsStore.you.id === player.id" class="player-avatar-icon" />
    <span v-else class="player-avatar-letter">
      {{ player.name.charAt(0).toUpperCase() }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { type Player } from '@/models/player'
import { useSettingsStore } from '@/stores/settingsStore'

defineProps<{
  player: Player
}>()

const settingsStore = useSettingsStore()
</script>

<style lang="scss" scoped>
.player-avatar {
  height: 100%;
  aspect-ratio: 1 / 1;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  container-type: size;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.92);
  background:
    radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.3) 0%, transparent 42%),
    linear-gradient(165deg, color-mix(in srgb, var(--bg) 85%, white 15%) 0%, var(--bg) 62%);
  box-shadow:
    inset 0 2px 2px rgba(255, 255, 255, 0.35),
    inset 0 -2px 3px rgba(0, 0, 0, 0.22),
    0 3px 6px rgba(0, 0, 0, 0.25);

  &::before {
    content: '';
    position: absolute;
    inset: 8%;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.45);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 72% 80%, rgba(0, 0, 0, 0.18) 0%, transparent 46%);
    pointer-events: none;
  }

  .player-avatar-letter {
    position: relative;
    z-index: 1;
    font-size: 70cqh;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  }

  .player-avatar-icon {
    position: relative;
    z-index: 1;
    width: 80cqh;
    height: 80cqh;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35));
  }
}
</style>
