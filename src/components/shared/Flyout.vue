<template>
  <Teleport to="body">
    <Transition name="pop-up" @after-leave="$emit('animationEnd')">
      <div class="flyout" v-if="show">
        <div class="content" @click.stop>
          <slot />
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="show" class="flyout-backdrop" @click="$emit('closeRequest')"></div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()
defineEmits(['closeRequest', 'animationEnd'])
</script>

<style lang="scss" scoped>
.flyout {
  position: fixed;
  height: 100dvh;
  min-height: 100svh;
  width: 100vw;
  max-width: min(100vw, $max-width-app);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .content {
    flex: 1;
    overflow: visible;
    width: min(92vw, 28rem);
    max-width: min(100vw, $max-width-app);
    position: relative;
    z-index: 1001;
  }
}

.flyout-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  min-height: 100svh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-up-enter-active,
.pop-up-leave-active {
  transition: all 0.3s ease;
}

.pop-up-enter-from,
.pop-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.pop-up-enter-to,
.pop-up-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
