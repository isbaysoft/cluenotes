<template>
  <Flyout :show="innerShow" @close-request="startClose" @animation-end="onAnimationEnd">
    <div role="dialog" id="modal-content">
      <div id="modal-content-title">
        <slot name="title" />
      </div>
      <div id="modal-content-body">
        <slot name="body" />
      </div>
      <div id="modal-content-actions">
        <slot name="actions" :close="startClose" />
      </div>
    </div>
  </Flyout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Flyout from '@/components/shared/Flyout.vue'

const emit = defineEmits(['onClose'])
const innerShow = ref(false)

onMounted(() => {
  innerShow.value = true
})

const startClose = () => {
  innerShow.value = false
}

const onAnimationEnd = () => {
  emit('onClose')
}
</script>

<style lang="scss" scoped>
#modal-content {
  @include flex-center(0.5rem);
  flex-direction: column;

  text-align: center;
  padding: $padding;
  background: linear-gradient(180deg, #fffef7 0%, #fff4cf 100%);
  margin: $padding;
  border-radius: 0.9rem;
  box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: calc(100dvh - 8rem);

  #modal-content-title {
    font-size: 1.5rem;
    width: 100%;
    color: $blue-grey-900;
  }

  #modal-content-body {
    padding: $padding;
    width: 100%;
    color: rgba($black, 0.9);
    overflow-y: auto;
    max-height: 100%;
  }

  #modal-content-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $padding-sm;
  }

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    background: rgba($orange-accent, 0.8);
    border-radius: 0.9rem;
    transform: rotate(2deg);
    width: calc(100% - 0.4rem);
    height: calc(100% + 0.5rem);
    left: 0.2rem;
    top: -0.25rem;
  }
}
</style>
