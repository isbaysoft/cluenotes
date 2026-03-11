<template>
  <h1>Settings</h1>
  <div>
    <div
      v-for="player in settingsStore.players"
      :key="player.id"
    >
      <input
        v-model="player.name"
        type="text"
        :style="{ borderColor: player.color }"
        :maxlength="PLAYER_NAME_MAX_LENGTH"
        @blur="player.name = player.name.trim()"
      >
      <button
        type="button"
        class="button primary"
        :disabled="settingsStore.playersCount <= 2"
        @click="settingsStore.removePlayer(player.id)"
      >
        -
      </button>
    </div>

    <button
      type="button"
      class="button primary"
      :disabled="settingsStore.playersCount >= 6"
      @click="settingsStore.addPlayer()"
    >
      +
    </button>

    <button
      type="button"
      class="button primary"
      @click="settingsStore.resetSettings"
    >
      Reset
    </button>
  </div>

  <RouterLink
    to="/"
    class="button primary"
  >
    Back
  </RouterLink>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settingsStore.js'
const settingsStore = useSettingsStore()
const PLAYER_NAME_MAX_LENGTH = 20
</script>
