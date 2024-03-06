<template>
    <div ref="blackjack"></div>
</template>

<script lang="ts" setup>

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


// Only load on client
if (process.client) {
    const { setupStage } = await import("~/games/blackjack/game");
    setupStage(blackjack);

}

</script>

<style scoped></style>
