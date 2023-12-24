<template>
  <div
    class="game-menu flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
  >
    <div class="flex flex-col gap-2">
      <nuxt-link
        to="/blackjack"
        class="text-xl font-bold text-white transition-all duration-300 ease-in-out hover:text-yellow-500"
      >
        Blackjack
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: "Home | Gamble Buddy",
  meta: [
    {
      name: "description",
      content: "Home page.",
    },
  ],
});
</script>

<style scoped lang="scss"></style>
