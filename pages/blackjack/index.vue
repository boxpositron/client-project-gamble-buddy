<template>
  <div ref="blackjack"></div>
</template>

<script lang="ts" setup>
import { setupGame } from "~/pages/blackjack/game";

useHead({
  title: "Blackjack | Gamble Buddy",
  meta: [
    {
      name: "description",
      content: "Basic blackjack game.",
    },
  ],
});

definePageMeta({
  layout: "game",
});

const blackjack = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const { setupStage } = setupGame();
  setupStage(blackjack);
});
</script>

<style scoped></style>
