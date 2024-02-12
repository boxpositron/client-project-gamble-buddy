<template>
  <div class="px-5 py-5 lg:px-20 lg:py-20">
    <div class="flex w-full flex-col gap-2">
      <nuxt-link
        to="/blackjack"
        class="relative text-center text-xl font-bold text-white transition-all duration-300 ease-in-out before:absolute before:left-0 before:top-1/2 before:h-1 before:w-full before:bg-white/10 hover:text-yellow-500"
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
