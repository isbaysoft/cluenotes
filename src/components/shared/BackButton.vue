<template>
  <div class="back-button" @click="gotoBack">
    <icon-material-symbols-arrow-back-rounded />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const props = defineProps<{
  routeName: string
}>()

const router = useRouter()

const gotoBack = () => {
  return router.push({ name: props.routeName })
}
</script>

<style lang="scss" scoped>
.back-button {
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($white, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  position: absolute;
  left: 16px;
  top: 16px;
  z-index: 100;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
