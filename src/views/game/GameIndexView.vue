<template>
  <div class="game-index-view">
    <RouterView v-slot="{ Component }">
      <Transition
        name="fade"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>
