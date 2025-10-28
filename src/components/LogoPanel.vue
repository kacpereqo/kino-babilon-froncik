<template>
  <div class="container">
    <img src="/logo.webp" />
    <span id="minecraft-effect" ref="effectElement"></span>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const MINECRAFT_PHRASES = [
  'Codziennie ale nie dzisiaj!',
  'Nie dzisiaj, może jutro!',
  'Topol gej!',
  'Oskar to gej!',
  'Największe cyce w pokoju ma... Oskar!',
  'Łapcie włosy kto może',
  '2137',
  'top 5 filmów które rozpierdolą ci łeb',
  'Żona pierze, ja se leże',
  'Kto nie skacze, ten basista',
  'MAM TE MOOOC!',
  'Zapisałeś sie na listę?',
  'Dzisiaj urodziny Ani',
  'Znacie żart o selerze?',
  'KINO BABILON ZAPRASZA',
  'JESTEM NIEŚMIERTELNY',
  'BOŻE DAJ MI SIŁY',
  'Jutro tuc... PIJEMY!!!',
  'Arnest Entolak',
  'Zbieram na seks',
]

const effectElement = ref<HTMLElement | null>(null)

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * MINECRAFT_PHRASES.length)

  if (effectElement.value) {
    const text = MINECRAFT_PHRASES[randomIndex]
    if (text) {
      effectElement.value.textContent = text
    }
  }
})
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container img {
  width: 100%;
  height: 100%;
}

@keyframes minecraft-animation {
  0%,
  100% {
    scale: 1;
  }
  50% {
    scale: 2;
  }
}

#minecraft-effect {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: var(--font-size-minecraft);
  color: var(--color-highlight);
  transform: translate(40%, 0) rotate(-20deg);
  user-select: none;
  animation: minecraft-animation var(--animation-duration-minecraft) infinite var(--animation-ease);
}
</style>
