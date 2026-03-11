<template>
  <div class="modal-container">
    <div v-for="modal in modalService.stack" :key="modal.id">
      <component :is="modal.component" v-bind="modal.props" @on-close="modalService.close(modal.id, $event)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { modalService } from '@/services/modal/service'
</script>
