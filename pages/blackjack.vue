<template>
  <div
    class="blackjack-game flex min-h-screen flex-col border-2 border-t-0 border-yellow-500 bg-black"
    ref="blackjack"
  ></div>
</template>

<script lang="ts" setup>
import { Application, Sprite, Container } from "pixi.js";
import {
  getDeck,
  type SupportedDeck,
  SupportedDecks,
  type Card,
} from "~/data/deck";

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

type EnhancedCard = Card & {
  sprite: Sprite;
};

const PlayerTypes = {
  dealer: "dealer",
  player: "player",
  opponent: "opponent",
} as const;

type PlayerType = (typeof PlayerTypes)[keyof typeof PlayerTypes];

function setupPlayer(type: PlayerType) {
  const playerContainer = new Container();

  playerContainer.width = 100;
  playerContainer.height = 100;

  switch (type) {
    case PlayerTypes.dealer: {
      playerContainer.x = 0;
      playerContainer.y = 0;

      break;
    }
    case PlayerTypes.player: {
      break;
    }
    case PlayerTypes.opponent: {
      break;
    }
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
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
  });

  blackjack.value?.appendChild(app.view as unknown as Node);

  setupPlayer(PlayerTypes.dealer);
  setupPlayer(PlayerTypes.player);
  setupPlayer(PlayerTypes.opponent);
}

function fetchDeckSprites(type: SupportedDeck): EnhancedCard[] {
  const deck = getDeck(type);

  const deckSprites: EnhancedCard[] = [];

  for (let card of deck.cards) {
    const sprite = Sprite.from(card.path);
    deckSprites.push({
      ...card,
      sprite,
    });
  }

  return deckSprites;
}

onMounted(() => {
  setupStage();
});
</script>

<style></style>
