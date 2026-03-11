<template>
  <div class="logo-area">
    <h1 class="game-title shadow">
      <span>CL</span>
      <span class="letter-u">U</span>
      <span>E</span>
      <div class="badge-container">
        <span class="badge">NOTES</span>
      </div>
    </h1>
    <p class="subtitle shadow">{{ subtitle }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  subtitle: string
}>()
</script>

<style lang="scss" scoped>
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;

  .shadow {
    text-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  }

  .game-title {
    display: flex;
    gap: 0.1rem;
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    transform: rotate(-3deg);

    .letter-u {
      color: $color-no;
    }

    .badge-container {
      margin-left: 1rem;

      .badge {
        text-shadow: none;
        background: $yellow-main;
        color: $blue-dark;
        padding: 2px 10px;
        border-radius: 8px;
        font-size: 0.5em;
        vertical-align: middle;
        box-shadow: 0 4px 0 $orange-shadow;
      }
    }
  }

  .subtitle {
    font-size: 1.3rem;
    margin: 0;
    opacity: 0.8;
    font-weight: 700;
  }
}
</style>
