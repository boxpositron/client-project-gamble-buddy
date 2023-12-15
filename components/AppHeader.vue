<template>
  <header>
    <nav
      class="flex min-h-full flex-row border-b-2 border-b-yellow-500 bg-slate-900 px-10 py-5 shadow-xl md:px-20"
    >
      <div class="left my-auto">
        <nuxt-link
          to="/"
          class="text-xl font-bold text-yellow-500 no-underline"
        >
          Gamble Buddy
        </nuxt-link>
      </div>

      <div class="right my-auto ml-auto">
        <ul>
          <li>
            <nuxt-link class="text-md text-white no-underline" to="/blackjack">
              BlackJack
            </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup></script>

<style></style>
