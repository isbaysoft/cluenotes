<template>
  <div>
    <div class="cards-picker">
      <div class="select-cards-tab">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="button primary"
          :class="{ active: selectedTab === tab }"
          @click="selectedTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div
        v-if="selectedTab === 'suspects'"
        class="suspects"
      >
        <h2>Suspects</h2>
        <ul>
          <li
            v-for="card in deckStore.suspects"
            :key="card.id"
            @click="deckStore.toggleCardOwner(card, settingsStore.you.id)"
          >
            {{ card.name }}
          </li>
        </ul>
      </div>

      <div
        v-if="selectedTab === 'weapons'"
        class="weapons"
      >
        <h2>Weapons</h2>
        <ul>
          <li
            v-for="card in deckStore.weapons"
            :key="card.id"
            @click="deckStore.toggleCardOwner(card, settingsStore.you.id)"
          >
            {{ card.name }}
          </li>
        </ul>
      </div>

      <div
        v-if="selectedTab === 'rooms'"
        class="rooms"
      >
        <h2>Rooms</h2>
        <ul>
          <li
            v-for="card in deckStore.rooms"
            :key="card.id"
            @click="deckStore.toggleCardOwner(card, settingsStore.you.id)"
          >
            {{ card.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useDeckStore } from '@/stores/deckStore.js'

const deckStore = useDeckStore()
const tabs = ['suspects', 'weapons', 'rooms']
const selectedTab = ref('suspects')
</script>
<style lang="scss" scoped>
.cards-picker {
  display: flex;
  flex-direction: column;
  align-items: center;

  .select-cards-tab {
    display: flex;
    flex-direction: row;
    gap: 10px;
    .button {
    }
  }
}
</style>
