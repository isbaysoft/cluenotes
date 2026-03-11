<template>
  <div class="player-picker">
    <button :data-testid="`pick-player-${player.id}`" v-for="(player, index) in players" :key="player.id"
      class="player-card" :class="{ selected: selectedPlayerId === player.id }" :style="playerCardStyle(index)"
      @click="$emit('onSelect', player.id)">
      <Avatar class="player-avatar" :player="player" />
      <div class="player-info">
        <span class="name">{{ player.name }}</span>
        <span class="meta">{{ isYou(player.id) ? 'Your turn' : 'Tap to select' }}</span>
      </div>
      <span v-if="selectedPlayerId === player.id" class="selected-pill">
        {{ selectedLabel }}
      </span>
    </button>

    <button data-testid="pick-player-nobody" v-if="allowDisprove" class="player-card nobody"
      :class="{ selected: disproved }" :style="nobodyCardStyle" @click="$emit('onSelect', null)">
      <span class="nobody-icon">
        <icon-material-symbols-do-not-disturb-on-rounded />
      </span>
      <div class="player-info">
        <span class="name">Nobody</span>
        <span class="meta">No one could stop the suggestion</span>
      </div>
      <span v-if="disproved" class="selected-pill">NOBODY STOPPED</span>
    </button>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore.js'
import Avatar from '@/components/shared/PlayerAvatar.vue'

const props = defineProps<{
  selectedPlayerId: string | null
  exclude?: string[]
  disproved?: boolean
  allowDisprove?: boolean
  selectedLabel?: string
}>()
defineEmits(['onSelect'])

const settingsStore = useSettingsStore()
const players = computed(() => settingsStore.players.filter((p) => !props.exclude?.includes(p.id)))
const isYou = (playerId: string) => settingsStore.you.id === playerId
const selectedLabel = computed(() => props.selectedLabel || 'ASKING')
const nobodyCardStyle = {
  '--rotation': '0.6deg',
  '--card-width': '90%',
  '--card-shift': '6px',
  '--delay': '0.28s',
  '--translate-dx': '4rem',
}

const playerCardStyle = (index: number) => {
  const angles = ['-1.2deg', '0.8deg', '-0.7deg', '1.1deg', '-0.9deg', '0.6deg']
  const widths = ['96%', '92%', '95%', '93%', '97%', '94%']
  const shifts = ['-6px', '4px', '-2px', '5px', '-4px', '3px']
  const delay = `${index * 0.1}s`
  return {
    '--rotation': angles[index % angles.length],
    '--card-width': widths[index % widths.length],
    '--card-shift': shifts[index % shifts.length],
    '--delay': delay,
    '--translate-dx': index % 2 ? '5rem' : '-5rem',
  }
}
</script>

<style lang="scss" scoped>
.player-picker {
  @include flex-center($padding);
  flex-direction: column;

  height: 100%;
  container-type: size;
  --item-gap: clamp(0.55rem, 2.2vh, 1rem);
  --item-height: calc((100cqh - (var(--item-gap) * 6)) / 6);
  gap: var(--item-gap);
  padding-bottom: 0.15rem;

  .player-card {
    @include shadow;

    width: var(--card-width, 100%);
    height: var(--item-height);
    background: $white;
    border: $border-width solid white;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    gap: $padding-sm;
    padding-right: $padding-sm;
    cursor: pointer;
    transform: translateX(var(--card-shift, 0)) rotate(var(--rotation));
    transition:
      transform 0.2s,
      background-color 0.2s,
      box-shadow 0.2s;
    color: $black;
    text-align: left;
    will-change: opacity, translate;
    animation: slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    animation-delay: var(--delay);
    container-type: size;

    &.nobody {
      background: rgba($white, 0.92);
      border-color: rgba($white, 0.9);
      color: $blue-dark;

      .nobody-icon {
        height: 70cqh;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        color: $white;
        background: linear-gradient(160deg, #7b8894 0%, #4e5964 100%);
        border: 2px solid rgba($white, 0.92);
        box-shadow:
          inset 0 1px 2px rgba(255, 255, 255, 0.3),
          0 2px 6px rgba(0, 0, 0, 0.22);
        font-size: 1.35rem;
      }

      .player-info {
        .name {
          font-size: 1.1rem;
        }

        .meta {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    &.nobody.selected {
      background: #ffe9ea;
      border-color: #ff9fa2;
      color: #a92a2f;
      box-shadow:
        0 6px 0 #dc4a4f,
        0 0 0 3px rgba($white, 0.3);

      .selected-pill {
        background: #a92a2f;
      }

      .meta {
        color: #a92a2f;
        opacity: 0.85;
      }
    }

    &:active {
      transform: translateX(var(--card-shift, 0)) rotate(var(--rotation)) translateY(4px);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
    }

    &.selected {
      background: $yellow-main;
      border-color: $yellow-main;
      color: $blue-dark;
      box-shadow:
        0 6px 0 $orange-shadow,
        0 0 0 3px rgba($white, 0.3);
      transform: translateX(var(--card-shift, 0)) rotate(var(--rotation)) scale(1.01);
    }

    .player-avatar {
      height: 80cqh;
    }

    .player-info {
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;

      .name {
        display: block;
        font-size: 1.2rem;
        font-weight: 800;
        line-height: 1.1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        font-size: 0.72rem;
        letter-spacing: 0.03em;
        opacity: 0.75;
        text-transform: uppercase;
      }
    }

    .selected-pill {
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      padding: 0.2rem 0.45rem;
      border-radius: 999px;
      color: $white;
      background: rgba($blue-dark, 0.92);
      flex-shrink: 0;
    }
  }
}

/* ANIMATIONS */
@keyframes slideIn {
  from {
    opacity: 0;
    translate: var(--translate-dx) 0;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (max-height: 760px) {
  .player-picker {
    --item-gap: 0.5rem;
  }
}
</style>
