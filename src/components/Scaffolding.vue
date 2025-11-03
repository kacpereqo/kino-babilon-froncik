<template>
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
      <LogoPanel />
    </div>

    <div class="bottom-content">
      <div id="left-panel">
        <div id="login-panel" class="scaffolding-element">
          <LoginPanel v-if="!authStore.isAuthenticated" />
          <UserPanel v-else />
        </div>
        <div id="navigation" class="scaffolding-element">
          <Navigation />
        </div>
      </div>

      <div class="main-content scaffolding-element">
        <marquee>DZISIAJ W 712: HALLOWEEN</marquee>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navigation from './NavigationPanel.vue'
import LoginPanel from './LoginPanel.vue'
import LogoPanel from './LogoPanel.vue'
import UserPanel from './UserPanel.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()
</script>

<style>
@import url('/styles/variables.css');
@import url('/styles/global.css');
</style>

<style scoped>
@keyframes container-animation {
  0%,
  100% {
    box-shadow: var(--box-shadow-base);
  }
  50% {
    box-shadow: var(--box-shadow-animated);
  }
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

#container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--content-gap);
  width: var(--container-width);
  height: 100vh;
  padding: var(--container-padding);
  background-image: url('/metal_plate.jpg');
  box-shadow: var(--box-shadow-base);
  animation: container-animation var(--animation-duration-container) infinite var(--animation-ease);
}

.light {
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: var(--light-height);
  pointer-events: none;
  overflow: hidden;
  background: linear-gradient(
    to right,
    rgba(var(--color-primary-rgba), 0.05) 0%,
    rgba(var(--color-primary-rgba), 0.3) 25%,
    rgba(var(--color-primary-rgba), 0.45) 50%,
    rgba(var(--color-primary-rgba), 0.3) 75%,
    rgba(var(--color-primary-rgba), 0.05) 100%
  );
  clip-path: polygon(0 200%, 0 120%, 100% 0, 100% 100%);
  filter: blur(var(--blur-strength));
  animation: gradient-move 2s infinite linear;
  z-index: -1;
}

.light-left {
  right: 100%;
  transform-origin: right center;
  clip-path: polygon(100% 200%, 100% 120%, 0 0, 0 100%);
  animation: light-animation-left var(--animation-duration-light) infinite var(--animation-ease);
}

.light-right {
  left: 100%;
  transform-origin: left center;
  animation: light-animation-right var(--animation-duration-light) infinite var(--animation-ease);
}

.scaffolding-element {
  background-color: black;
  padding: var(--container-padding);
}

#navigation {
  flex: 1;
}

#left-panel {
  width: var(--left-panel-width);
  display: flex;
  flex-direction: column;
  gap: var(--content-gap);
  min-height: 0;
}

.bottom-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: var(--content-gap);
  min-height: 0;
}

.main-content {
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow: auto;
  width: 100%;
  padding: 20px;
  position: relative;
  overflow-y: scroll;
  scrollbar-width: thin;
  background-color: var(--color-bg-main);
}

.main-content marquee {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
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
#logo {
  height: 20%;
}

@media (max-width: 1048px) {
  #container {
    width: 100vw;
    padding: 20px;
  }

  #logo {
    height: 15%;
  }

  #left-panel {
    width: 200px;
  }
}
</style>
