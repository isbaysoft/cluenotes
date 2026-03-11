import { defineAsyncComponent } from 'vue'

export const modalRegistry = {
  information: defineAsyncComponent(
    () => import('@/components/shared/modals/InformationModal.vue'),
  ),
  confirmation: defineAsyncComponent(
    () => import('@/components/shared/modals/ConfirmationModal.vue'),
  ),
} as const
