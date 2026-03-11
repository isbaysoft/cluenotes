<template>
  <div class="toast-wrapper">
    <TransitionGroup
      name="toast-anim"
      tag="div"
      class="toast-stack"
    >
      <div
        v-for="toast in toastService.stack"
        :key="toast.id"
        class="toast-card"
        :class="[`type-${toast.type}`]"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'warning'">⚠️</span>
          <span v-else-if="toast.type === 'error'">⛔</span>
          <span v-else>✅</span>
        </div>

        <div class="toast-content">
          <div
            v-if="toast.title"
            class="toast-title"
          >
            {{ toast.title }}
          </div>
          <div class="toast-message">
            {{ toast.message }}
          </div>
        </div>

        <button
          class="toast-close"
          @click="toastService.close(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { toastService } from '@/services/toast/service'
</script>

<style lang="scss" scoped>
.toast-wrapper {
  position: fixed;
  bottom: calc(1rem + 56px + 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 100%;
  max-width: min(100vw, $max-width-app - 1rem);
  pointer-events: none;
}

.toast-stack {
  display: flex;
  flex-direction: column;
}

.toast-card {
  pointer-events: auto;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 14px 16px;
  margin-top: 10px;
  max-height: 200px;

  background: #2c3e50;
  color: #ecf0f1;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-left: 5px solid #bdc3c7;

  overflow: hidden;

  /* Типы */
  &.type-warning {
    border-left-color: #f39c12;
  }
  &.type-error {
    border-left-color: #e74c3c;
  }
  &.type-success {
    border-left-color: #27ae60;
  }

  .toast-content {
    flex: 1;
    text-align: left;
    font-size: 1rem;
  }

  .toast-title {
    font-weight: 800;
    font-size: 0.8rem;
    text-transform: uppercase;
    margin-bottom: 2px;
    white-space: nowrap;
  }

  .toast-message {
    font-size: 0.7rem;
    opacity: 0.9;
  }

  .toast-close {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 18px;
    padding: 0 0 0 10px;
    align-self: stretch;

    &:hover {
      color: white;
    }
  }
}

.toast-anim-move,
.toast-anim-enter-active,
.toast-anim-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.toast-anim-enter-from {
  opacity: 0;
  transform: translateY(30px);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}

.toast-anim-leave-active {
  z-index: 0;
}

.toast-anim-leave-to {
  opacity: 0;
  transform: translateY(50px);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}
</style>
