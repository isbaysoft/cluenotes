<template>
  <BaseModal>
    <template #title>
      <slot name="title">{{ title }}</slot>
      <icon-ic-baseline-close v-if="canClose" id="modal-content-close" @click="$emit('onClose', null)" />
    </template>

    <template #body>
      <slot name="title">{{ body }}</slot>
    </template>

    <template #actions>
      <Button data-testid="modal-confirmation-cancel-button" class="button secondary small"
        @click="$emit('onClose', false)">
        {{ cancelButtonText || 'Cancel' }}
      </Button>
      <Button data-testid="modal-confirmation-confirm-button" class="button primary small"
        @click="$emit('onClose', true)">
        {{ confirmButtonText || 'Confirm' }}
      </Button>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import Button from '@/components/shared/Button.vue'
import BaseModal from '@/components/shared/modals/BaseModal.vue'
import type { ConfirmationModalProps } from '@/services/modal/props'

defineProps<ConfirmationModalProps>()
defineEmits(['onClose'])
</script>

<style lang="scss">
#modal-content-close {
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;
}
</style>
