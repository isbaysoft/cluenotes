<template>
  <div class="app-wrapper">
    <div class="phone-container">
      <div
        v-if="isReady"
        class="app-content"
      >
        <RouterView v-slot="{ Component }">
          <Transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
        <ModalContainer />
        <ToastContainer />
      </div>
      <div
        v-else
        class="loading-screen"
      >
        <Transition name="fade">
          <div
            v-if="showLoader"
            class="loader-content"
          >
            <h1>Loading Evidence...</h1>
            <p>{{ progress }}%</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useImagePreloader } from '@/composables/useImagePreloader'
import { allAssetsUrls } from '@/utils/assets' // <--- Імпортуємо масив
import ModalContainer from '@/components/ModalContainer.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const { isReady, showLoader, progress, preloadAll } = useImagePreloader()

onMounted(async () => {
  await preloadAll(allAssetsUrls)
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100dvh;
  min-height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background: rgba($orange-accent, 0.9);
    transform: rotate(1deg);
    width: calc(100% + 1rem);
    height: calc(100% - 1rem);
    left: -0.5rem;
    top: 0.5rem;
  }

  .phone-container {
    width: 100%;
    max-width: $max-width-app;
    height: 100dvh;
    min-height: 100svh;
    box-shadow: 0 0 0 8px rgba($white, 0.1);
    position: relative;
    overflow-x: hidden;
    background: radial-gradient(circle at center, $blue-bg 0%, $blue-dark 100%);
  }
}

@media (max-width: 500px) {
  .phone-container {
    max-width: 100%;
    box-shadow: none;
  }
}

.loading-screen {
  height: 100dvh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #222;
  color: #fff;

  .loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $padding;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-screen {
  background: black;
}
</style>
