<template>
  <BaseModal @onClose="$emit('onClose')">
    <template #title>
      <slot name="title">{{ title }}</slot>
    </template>

    <template #body>
      <slot name="body">
        <p v-if="isText">
          {{ body }}
        </p>
        <component v-else :is="body" />
      </slot>
    </template>

    <template #actions="{ close }">
      <Button class="button primary" @click="close()">
        {{ confirmButtonText || 'OK' }}
      </Button>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Button from '@/components/shared/Button.vue'
import BaseModal from '@/components/shared/modals/BaseModal.vue'
import type { InformationModalProps } from '@/services/modal/props'

const props = defineProps<InformationModalProps>()
defineEmits(['onClose'])

const isText = computed(() => typeof props.body === 'string')
</script>
