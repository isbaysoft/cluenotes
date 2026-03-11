<template>
  <img :src="getCardImageUrl(card.type, card.image)" :alt="card.name" />
</template>

<script lang="ts" setup>
import { type Card } from '@/models/card'
import { getCardImageUrl } from '@/utils/assets'

defineProps<{
  card: Card
}>()
</script>
