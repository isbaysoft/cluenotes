<template>
  <div class="game-log-view">
    <SuggestionWizard
      v-if="selectedSuggestion !== null"
      :suggestion="selectedSuggestion"
      @onClose="selectedSuggestion = null"
    />

    <header class="fixed-header">
      <div class="title-exit">
        <h1>History</h1>
        <RouterLink to="/game/play" class="close-button">
          <icon-ic-baseline-close />
        </RouterLink>
      </div>
      <div class="subtitle">{{ pluralize('turn', orderedSuggestions.length, true) }} logged</div>
    </header>

    <main class="scroll-container">
      <div v-if="orderedSuggestions.length === 0" class="empty-state">
        <icon-ic-sharp-manage-search class="icon" />
        <h3>Waiting for the first move!</h3>
        <p>Make a suggestion to see it listed here.</p>
      </div>
      <div class="feed-list">
        <div
          v-for="(suggestion, idx) in orderedSuggestions"
          :key="suggestion.id"
          class="feed-card"
          :class="{ danger: !suggestion.disprovedByPlayerId || suggestion.accusing }"
        >
          <div class="card-header">
            <div class="card-header-info">
              <div class="avatar">
                <Avatar :player="playerOrFallback(suggestion.askedByPlayerId)" />
              </div>
              <div class="header-info">
                <div class="asker-name">
                  {{ playerName(suggestion.askedByPlayerId) }}
                </div>
                <div class="turn-label">Turn #{{ orderedSuggestions.length - idx }}</div>
              </div>
            </div>
            <div class="menu">
              <button class="menu-item-btn edit" @click="selectedSuggestion = suggestion">
                <icon-ic-baseline-edit class="menu-item" />
              </button>
              <button class="menu-item-btn delete" @click="deleteSuggestion(suggestion.id)">
                <icon-ic-baseline-delete-forever class="menu-item" />
              </button>
            </div>
          </div>

          <div class="card-rack">
            <div
              v-for="cardType in CARD_TYPES"
              :key="cardType"
              class="game-card-name card-chip"
              :class="[cardType, { showed: suggestion[cardType].id === suggestion.shownCardId }]"
            >
              {{ suggestion[cardType].name }}
            </div>
          </div>

          <div class="card-footer">
            <div v-if="suggestion.accusing" class="status-bar">
              <span v-if="suggestion.accustionConfirmed" class="accusation-confirmed">
                Accusation confirmed
              </span>
              <span v-else class="accusation-failed">Accusation failed</span>
            </div>
            <template v-else>
              <div v-if="!suggestion.disprovedByPlayerId" class="status-bar danger">
                <icon-ic-round-warning-amber class="status-icon" />
                No one disproved
              </div>
              <div
                v-else
                class="status-bar"
                :class="suggestion.shownCardId ? 'success' : 'neutral'"
              >
                <div class="responder-row">
                  <span class="label">Disproved by:</span>
                  <span class="value">{{ playerName(suggestion.disprovedByPlayerId) }}</span>
                  <span v-if="suggestion.shownCardId">
                    showed
                    <strong>{{ cardName(suggestion.shownCardId) }}</strong>
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useNotebookStore } from '@/stores/notebookStore'
import pluralize from 'pluralize'
import Avatar from '@/components/shared/PlayerAvatar.vue'
import { modalService } from '@/services/modal/service'
import { CARD_TYPES } from '@/models/card'
import { type Suggestion } from '@/models/suggestion'
import { type Player } from '@/models/player'

const settingsStore = useSettingsStore()
const notebookStore = useNotebookStore()
const selectedSuggestion = ref<Suggestion | null>(null)

const orderedSuggestions = computed(() => {
  return [...settingsStore.suggestions].reverse()
})

const deleteSuggestion = async (suggestionId: string) => {
  const confirmed = await modalService.open({
    type: 'confirmation',
    title: 'Delete suggestion',
    body: 'This suggestion will be permanently removed. Are you sure?',
    confirmButtonText: 'Delete',
  })

  if (confirmed) {
    settingsStore.removeSuggestion(suggestionId)
  }
}

const playerOrFallback = (playerId: string | null): Player => {
  return settingsStore.findPlayerById(playerId) ?? settingsStore.you
}

const playerName = (playerId: string | null): string => {
  return playerOrFallback(playerId).name
}

const cardName = (cardId: string): string => {
  return notebookStore.findCardById(cardId)?.name ?? 'Unknown card'
}
</script>

<style scoped lang="scss">
.game-log-view {
  height: 100dvh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  overflow: hidden;

  .empty-state {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    color: #888;
    padding: 20px;

    .icon {
      font-size: 5rem;
      padding: $padding;
    }

    .h3 {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #555;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      max-width: 250px;
    }
  }
}

.fixed-header {
  flex: 0 0 auto;
  padding: 15px 20px;
  border-bottom: 1px solid rgba($white, 0.12);
  background: linear-gradient(180deg, rgba($white, 0.16) 0%, rgba($white, 0.08) 100%);
  backdrop-filter: blur(3px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 10;

  .title-exit {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      color: $deep-purple-800;
      background: rgba($white, 0.65);
    }
  }

  h1 {
    margin: 0;
    font-size: 1.4rem;
    color: #1a1a1a;
  }

  .subtitle {
    font-size: 0.8rem;
    color: #888;
    margin-top: 4px;
  }
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.feed-list {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 50px;
}

.feed-card {
  background: rgba($white, 0.9);
  border-radius: 14px;
  border: 1px solid rgba($white, 0.85);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.09);
  overflow: hidden;

  &.danger {
    border-color: rgba($orange-accent, 0.7);
    box-shadow:
      0 5px 14px rgba(0, 0, 0, 0.1),
      0 0 0 2px rgba($orange-accent, 0.22);
  }
}

.card-header {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(#dce3ea, 0.75);
  justify-content: space-between;

  .card-header-info {
    display: flex;
    gap: $padding-sm;
  }

  .menu {
    display: flex;
    gap: 0.35rem;

    .menu-item-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 0.55rem;
      border: 1px solid rgba(#ced6df, 0.9);
      background: rgba($white, 0.82);
      display: grid;
      place-items: center;
      cursor: pointer;

      &.delete {
        color: #b71c1c;
      }

      &.edit {
        color: #0d47a1;
      }

      .menu-item {
        font-size: 1.15rem;
      }
    }
  }

  .name {
    display: flex;
    align-items: center;
  }
}

.avatar {
  width: 2rem;
  height: 2rem;
}

.header-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.asker-name {
  font-weight: 700;
  color: #333;
  font-size: 1.02rem;
  line-height: 1.15;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.turn-label {
  font-size: 0.75rem;
  color: #687b8c;
  text-transform: uppercase;
}

.card-rack {
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  background: rgba(#f7f9fb, 0.9);

  .card-chip {
    border-radius: 999px;
    border: 2px solid rgba(#d4d9de, 0.9);
    background: rgba($white, 0.95);
    font-size: 0.82rem;
    font-weight: 800;
    padding: 0.28rem 0.7rem;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.card-footer {
  font-size: 0.9rem;
}

.status-bar {
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $padding-sm;

  &.neutral {
    background: #e8ecef;
    color: #444;
  }
  &.danger {
    background: #ffebee;
    color: #c62828;
    font-weight: 700;
    justify-content: center;
  }
  &.success {
    background: #e8f5e9;
    color: #2e7d32;
  }
}

.accusation-confirmed {
  color: #1b5e20;
  font-weight: 800;
}

.accusation-failed {
  color: #b71c1c;
  font-weight: 800;
}

.responder-row {
  display: flex;
  gap: 5px;

  .value {
    font-weight: 700;
  }
}
.shown-info {
  background: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
