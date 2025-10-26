<template>
  <div id="app">
    <div class="video-bg">
      <iframe
        src="https://www.youtube.com/embed/3SEBEh_t5K8?autoplay=1&mute=1&controls=0&loop=1&playlist=tFzPwdBBRRw"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      >
      </iframe>
    </div>

    <div id="container">
      <div class="light light-left"></div>
      <div class="light light-right"></div>
      <div id="logo" class="scaffolding-element">
        <img src="/logo.webp" />
        <span id="minecraft-effect" ref="effectElement"></span>
      </div>

      <div class="bottom-content">
        <div id="left-panel">
          <div id="login-panel">
            <a href="#" @click="openDiscordPopup">Zaloguj się</a>
          </div>
          <div id="navigation" class="scaffolding-element">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/">Kalendarz</a></li>
              <li><a href="/">Głosowanie</a></li>
              <li><a href="/">Sex</a></li>
              <li><a href="/galeria">Galeria</a></li>
            </ul>
          </div>
        </div>

        <div class="main-content scaffolding-element">
          <router-view />
        </div>
      </div>
    </div>
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
const loginButton = ref<HTMLAnchorElement | null>(null)

function openDiscordPopup() {
  // Step 1. Get login URL from backend
  fetch('http://127.0.0.1:8000/auth/login')
    .then((r) => r.json())
    .then((data) => {
      const loginUrl = data.url
      const width = 600
      const height = 700
      const left = window.screenX + (window.innerWidth - width) / 2
      const top = window.screenY + (window.innerHeight - height) / 2

      const popup = window.open(
        loginUrl,
        'discord_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top}`,
      )

      if (!popup) {
        alert('Popup blocked! Please allow popups for this site.')
        return
      }

      // Step 2. Poll the popup until it redirects to /auth/callback
      const pollInterval = setInterval(async () => {
        try {
          if (popup.closed) {
            clearInterval(pollInterval)
            alert('Login window closed.')
            return
          }

          const popupUrl = popup.location.href

          // Once we detect redirect back to our API /callback
          if (popupUrl.startsWith('http://127.0.0.1:8000/auth/callback')) {
            // Try fetching user info
            const response = await fetch(popupUrl)
            const data = await response.json()

            console.log('OAuth data:', data)
            alert(`Logged in as ${data.user.nickname}`)

            // Optionally save tokens
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('user', JSON.stringify(data.user))

            clearInterval(pollInterval)
            popup.close()
          }
        } catch (err) {
          // Cross-origin while still on Discord
          // Expected until it redirects back to your domain
        }
      }, 500)
    })
}

onMounted(() => {
  if (effectElement.value) {
    const randomIndex = Math.floor(Math.random() * MINECRAFT_PHRASES.length)
    effectElement.value.textContent = MINECRAFT_PHRASES[randomIndex]
  }
})
</script>

<style>
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  color: white;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: black;
  z-index: 999;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped>
.scaffolding-element {
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
}

#minecraft-effect {
  position: absolute;
  bottom: 0px;
  font-size: 20px;
  color: yellow;
  text-shadow: -1px -1px 0 #000;
  right: 0;
  transform: translate(40%, 0) rotate(-20deg);
  user-select: none;
  animation: minecraft-animation 2s infinite ease-in-out;
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

#container {
  box-shadow:
    rgba(255, 0, 0, 0.25) 0px 54px 55px,
    rgba(255, 0, 0, 0.12) 0px -12px 30px,
    rgba(255, 0, 0, 0.12) 0px 4px 6px,
    rgba(255, 0, 0, 0.17) 0px 12px 13px,
    rgba(255, 0, 0, 0.09) 0px -3px 5px;
  background-image: url('/metal_plate.jpg');
  gap: 20px;
  width: 50%;
  padding: 20px;
  height: 100vh;
  background-color: lightblue;
  display: flex;
  flex-direction: column;
  animation: container-animation 5s infinite ease-in-out;
  position: relative;
}

.light {
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 100px; /* adjust the beam height */
  pointer-events: none;
  overflow: hidden;
  background: linear-gradient(
    to right,
    rgba(255, 0, 0, 0.05) 0%,
    rgba(255, 0, 0, 0.3) 30%,
    rgba(255, 0, 0, 0.45) 10%,
    rgba(255, 0, 0, 0.3) 25%,
    rgba(255, 0, 0, 0.05) 100%
  );
  clip-path: polygon(0 200%, 0 120%, 100% 0, 100% 100%);
  filter: blur(40px);
  animation: gradient-move 2s infinite linear;

  z-index: -1;
}

.light-left {
  right: 100%;
  transform-origin: right center;
  clip-path: polygon(100% 200%, 100% 120%, 0 0, 0 100%);
  animation: light-animation-left 10s infinite ease-in-out;
}

.light-right {
  left: 100%;
  transform-origin: left center;
  animation: light-animation-right 10s infinite ease-in-out;
}

@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes light-animation-left {
  0%,
  100% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(30deg);
  }
}

@keyframes light-animation-right {
  0%,
  100% {
    transform: rotate(-90deg);
  }
  50% {
    transform: rotate(-30deg);
  }
}

@keyframes container-animation {
  0%,
  100% {
    box-shadow:
      rgba(255, 0, 0, 0.25) 0px 54px 55px,
      rgba(255, 0, 0, 0.12) 0px -12px 30px,
      rgba(255, 0, 0, 0.12) 0px 4px 6px,
      rgba(255, 0, 0, 0.17) 0px 12px 13px,
      rgba(255, 0, 0, 0.09) 0px -3px 5px;
  }
  50% {
    box-shadow:
      rgba(255, 0, 0, 0.45) 0px 54px 55px,
      rgba(255, 0, 0, 0.32) 0px -12px 30px,
      rgba(255, 0, 0, 0.32) 0px 4px 6px,
      rgba(255, 0, 0, 0.37) 0px 12px 13px,
      rgba(255, 0, 0, 0.29) 0px -3px 5px;
  }
}

#logo {
  position: relative;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#logo img {
  width: 100%;
  height: 100%;
}

#login-panel {
  height: 150px;
  background-color: rgb(0, 0, 0);
}

#navigation {
  background-color: rgb(0, 0, 0);
  flex: 1;
}

#left-panel {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.bottom-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 20px;
  min-height: 0;
}

.main-content {
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow: auto;
  width: 100%;
  background-color: black;
}
.video-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.video-bg iframe {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
