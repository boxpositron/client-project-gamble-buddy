<template>
  <div class="blackjack-game flex min-h-screen flex-col" ref="blackjack"></div>
</template>

<script lang="ts" setup>
import { Application, Sprite } from "pixi.js";
import { getDeck, SupportedDecks } from "~/data/deck";

useHead({
  title: "Blackjack | Gamble Buddy",
  meta: [
    {
      name: "description",
      content: "Basic blackjack game.",
    },
  ],
});

const blackjack = ref<HTMLDivElement | null>(null);

async function setupDecks(app: Application) {
  const deck = getDeck(SupportedDecks.black);

  for (let card of deck.cards) {
    const sprite = Sprite.from(card.path);
    app.stage.addChild(sprite);
  }
}

function setupStage() {
  if (!blackjack.value) {
    return;
  }

  const currentPageWidth = blackjack.value.clientWidth;
  const currentPageHeight = blackjack.value.clientHeight;

  const app = new Application({
    width: currentPageWidth,
    height: currentPageHeight,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
  });

  blackjack.value?.appendChild(app.view as unknown as Node);

  setupDecks(app);
}

onMounted(() => {
  setupStage();
});
</script>

<style></style>
