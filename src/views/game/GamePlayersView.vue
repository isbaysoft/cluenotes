<template>
  <div class="game-players-view">
    <BackButton v-if="!route.query.edit" routeName="application" />
    <LogoArea subtitle="Who’s Playing?" />

    <div class="lobby-card">
      <div class="lobby-header">
        <div class="header-copy">
          <h2>Players</h2>
          <span class="reorder-hint">Drag cards to set turn order</span>
        </div>
        <span class="count"> {{ settingsStore.players.length }} / {{ settingsStore.maxPlayerCount }} </span>
      </div>

      <div data-testid="player-list-container" class="player-list-container">
        <draggable v-model="settingsStore.players" item-key="id" animation="200" class="player-list draggable"
          handle=".drag-grip">
          <template #item="{ element: player, index }">
            <div class="draggable-item">
              <div data-testid="player-list-item" class="player-strip"
                :class="{ undraggable: player.id === settingsStore.you.id, own: player.id === settingsStore.you.id }"
                :style="playerStripStyle(index)">
                <div class="strip-content">
                  <div class="avatar">
                    <PlayerAvatar :player="player" />
                  </div>

                  <input data-testid="player-name-input" v-model="player.name" placeholder="Name..." class="name-input"
                    :maxlength="PLAYER_NAME_MAX_LENGTH" @blur="player.name = player.name.trim()" />

                  <span v-if="player.id === settingsStore.you.id" class="you-badge">YOU</span>
                  <span v-else class="drag-grip">⋮⋮</span>

                  <button data-testid="btn-remove-player" v-if="!route.query.edit && player.id !== settingsStore.you.id"
                    class="btn-remove" @click="removePlayer(player.id)">
                    <icon-ic-round-close />
                  </button>
                </div>
              </div>
            </div>
          </template>
        </draggable>
        <div class="player-list empty">
          <div v-for="i in emptySlotsCount" :key="`empty-${i}`" class="player-strip empty" :style="emptySlotStyle(i)">
            <button data-testid="btn-add-player" class="btn-add-slot" @click="settingsStore.addPlayer()">
              + Add Player
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-action">
      <Button class="primary" @click="startGame" :disabled="settingsStore.players.length < 3">
        <span v-if="settingsStore.players.length < 3">Need at least 3 Players</span>
        <span v-else>
          {{ route.query.edit ? 'SAVE' : 'CONTINUE' }}
        </span>
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore.js'
import { useRouter, useRoute } from 'vue-router'
import { useNotebookStore } from '@/stores/notebookStore'
import { modalService } from '@/services/modal/service'
import LogoArea from '@/components/shared/LogoArea.vue'
import BackButton from '@/components/shared/BackButton.vue'
import PlayerAvatar from '@/components/shared/PlayerAvatar.vue'
import Button from '@/components/shared/Button.vue'
import draggable from 'vuedraggable'

const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

const notebookStore = useNotebookStore()
const PLAYER_NAME_MAX_LENGTH = 20

const emptySlotsCount = computed(() => {
  return settingsStore.maxPlayerCount - settingsStore.players.length
})

const playerStripStyle = (index: number) => {
  const angles = ['-1.5deg', '0.9deg', '-1deg', '1.2deg', '-0.7deg', '0.8deg']
  const shifts = ['-2px', '3px', '-1px', '2px', '-2px', '1px']
  return {
    '--card-rotate': angles[index % angles.length],
    '--card-shift': shifts[index % shifts.length],
  }
}

const emptySlotStyle = (index: number) => {
  const angles = ['-0.6deg', '0.6deg', '-0.4deg']
  return {
    '--empty-rotate': angles[index % angles.length],
  }
}

const startGame = () => {
  const routeName = route.query.edit ? 'game-play' : 'setup-cards'
  router.push({ name: routeName })
  notebookStore.initNotebook()
}

const removePlayer = async (playerId: string) => {
  const confirmed = await modalService.open({
    type: 'confirmation',
    title: 'Confirm deletion',
    body: 'Are you sure you want to delete this player?',
    confirmButtonText: 'Delete',
  })

  if (!confirmed) return
  settingsStore.removePlayer(playerId)
}
</script>

<style lang="scss" scoped>
.game-players-view {
  @include fullpage;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 12% 10%, rgba($white, 0.16) 0%, transparent 35%),
      radial-gradient(circle at 86% 85%, rgba($yellow-main, 0.1) 0%, transparent 36%);
    pointer-events: none;
  }

  .lobby-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 0;
  }

  .lobby-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.7rem;
    padding: 0 1rem;

    .header-copy {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      text-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.5);
    }

    .reorder-hint {
      font-size: 0.72rem;
      opacity: 0.82;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .count {
      background: rgba(0, 0, 0, 0.22);
      padding: 0.4rem 1rem;
      border-radius: 1rem;
      font-weight: 700;
      border: 1px solid rgba($white, 0.24);
      box-shadow: inset 0 1px 2px rgba($white, 0.15);
    }
  }

  .player-list-container {
    height: 100%;
    min-height: 0;
    container-type: size;
    --item-gap: 0.5rem;
    --item-height: calc((100cqh - (var(--item-gap) * 6)) / 6);

    .player-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--item-gap);
      padding: 0 1rem;

      &.empty {
        padding-top: var(--item-gap);
      }

      .player-strip {
        @include shadow;
        cursor: grab;

        &.undraggable {
          cursor: default;
        }

        display: flex;
        background: linear-gradient(90deg, $yellow-main, $orange-accent);
        border-radius: 0.8rem;
        transform: translateX(var(--card-shift, 0)) rotate(var(--card-rotate, -1.5deg));
        height: var(--item-height);
        transition: transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s ease;

        &:hover {
          transform: translateX(0) rotate(0deg) scale(1.01);
          z-index: 10;
        }

        &.empty {
          background: none;
          box-shadow: none;
          transform: rotate(var(--empty-rotate, 0deg));
        }

        .strip-content {
          background: rgba(255, 255, 255, 0.24);
          border: 0.2rem solid $white;
          border-radius: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0 0.5rem;
          container-type: size;

          .avatar {
            width: 80cqh;
          }
        }

        &.own {
          .strip-content {
            background: rgba($white, 0.35);
          }
        }
      }
    }
  }

  .name-input {
    background: transparent;
    border: none;
    font-weight: 900;
    font-size: 1.3rem;
    color: $blue-dark;
    flex: 1;
    width: 100%;
    border-radius: 0.35rem;

    &:focus-visible {
      outline: 2px solid rgba($blue-dark, 0.45);
      outline-offset: 2px;
      background: rgba($white, 0.25);
    }

    &::placeholder {
      color: rgba($blue-dark, 0.5);
    }
  }

  .btn-remove {
    background: rgba($orange-accent, 0.45);
    border: none;
    color: $blue-dark;
    width: 60cqh;
    height: 60cqh;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .drag-grip {
    display: grid;
    place-items: center;
    color: rgba($blue-dark, 0.55);
    width: 1.2rem;
    height: 1.2rem;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .you-badge {
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: $white;
    background: rgba($blue-dark, 0.92);
    border-radius: 999px;
    padding: 0.22rem 0.5rem;
    flex-shrink: 0;
  }

  .btn-add-slot {
    background: transparent;
    color: white;
    font-weight: 900;
    font-size: 1.1rem;
    cursor: pointer;
    border: none;
    width: 100%;
    height: 100%;
    border: 0.17rem dashed $white;
    box-sizing: border-box;
    border-radius: $border-radius;
    transition: all 0.18s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }
  }

  .footer-action {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
  }
}
</style>
