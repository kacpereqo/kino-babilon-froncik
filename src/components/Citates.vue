<template>
    <div class="container">
        <header>
            <h1>Złote myśli</h1>
            <h3>Ktoś musiał srać żeby to wymyślić</h3>
        </header>

        <ul id="citates-list">
            <li 
                class="citate" 
                v-for="(citate, index) in citates" 
                :key="index"
                :class="getCitateClass(index)"
            >
                {{ citate.text }}
                <div class="citate-stats">
                    <span><button @click="likeCitate(index)">👍 {{ citate.likes }}</button></span>
                    <span><button @click="dislikeCitate(index)">👎 {{ citate.dislikes }}</button></span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Citate {
    text: string;
    likes: number;
    dislikes: number;
}

const citates = ref<Citate[]>([
  { text: 'Codziennie ale nie dzisiaj!', likes: 0, dislikes: 0 },
  { text: 'Nie dzisiaj, może jutro!', likes: 0, dislikes: 0 },
  { text: 'Topol gej!', likes: 0, dislikes: 0 },
  { text: 'Oskar to gej!', likes: 0, dislikes: 0 },
  { text: 'Największe cyce w pokoju ma... Oskar!', likes: 0, dislikes: 0 },
  {text:'Łapcie włosy kto może', likes:0, dislikes:0},
  {text:'2137', likes:0, dislikes:0},
  {text:'top 5 filmów które rozpierdolą ci łeb', likes:0, dislikes:0},
  {text:'Żona pierze, ja se leże', likes:0, dislikes:0},
  {text:'Kto nie skacze, ten basista', likes:0, dislikes:0},
  {text:'MAM TE MOOOC!', likes:0, dislikes:0},
  {text:'Zapisałeś sie na listę?', likes:0, dislikes:0},
  {text:'Dzisiaj urodziny Ani', likes:0, dislikes:0},
  {text:'Znacie żart o selerze?', likes:0, dislikes:0},
  {text:'KINO BABILON ZAPRASZA', likes:0, dislikes:0},
  {text:'JESTEM NIEŚMIERTELNY', likes:0, dislikes:0},
  {text:'BOŻE DAJ MI SIŁY', likes:0, dislikes:0},
  {text:'Jutro tuc... PIJEMY!!!', likes:0, dislikes:0},
  {text:'Arnest Entolak', likes:0, dislikes:0},
  {text:'Zbieram na seks',  likes:0, dislikes:0},
])

function getCitateClass(index: number) {
  const classes = ['gold-shine', 'silver-shine']
    if (index == 0) {
        return classes[0];
    } else if (index == 1) {
        return classes[1];
    } else {
        return '';
    }
}

function likeCitate(index: number) {
  citates.value[index]!.likes += 1
}

function dislikeCitate(index: number) {
    citates.value[index]!.dislikes += 1;
}

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.citate {
    list-style-type: none;
    margin-bottom: 10px;
    padding: 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    background-clip: text;
    align-items: center;
    background-size: 200% auto;
}

/* --- GOLD SHINE --- */
.gold-shine {
    font-size: 20px;
    font-weight: bold;
    color: transparent;
    background-image: linear-gradient(
        to right,
        #8b6b00 0%,
        #d4af37 25%,
        #fff9db 50%,
        #d4af37 75%,
        #8b6b00 100%
    );
    animation: goldShine 3.5s linear infinite;
}

@keyframes goldShine {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
}

/* --- SILVER SHINE --- */
.silver-shine {
    font-weight: bold;
    font-size: 18px;
    color: transparent;
    background-image: linear-gradient(
        to right,
        #a0a0a0de 0%,
        #e6e6e6 25%,
        #f8f8f8 50%,
        #c0c0c0 75%,
        #a0a0a0c5 100%
    );
    animation: silverShine 4.5s linear infinite;
}

@keyframes silverShine {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
}

/* --- FIRE SHINE --- */
.fire-shine {
    background-image: linear-gradient(
        to right,
        #8b0000 0%,
        #ff4500 25%,
        #ffa500 50%,
        #ffff00 75%,
        #ff4500 100%
    );
    animation: fireShine 2.5s linear infinite, flicker 0.25s infinite alternate;
}

@keyframes fireShine {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
}

@keyframes flicker {
    0% { filter: brightness(0.9); }
    50% { filter: brightness(1.4); }
    100% { filter: brightness(1.1); }
}

#citates-list {
    list-style-type: disc;
}

.citate-stats {
    display: flex;
    gap: 10px;
}

button {
    padding: 10px;
    font-size: 16px;
}
</style>
