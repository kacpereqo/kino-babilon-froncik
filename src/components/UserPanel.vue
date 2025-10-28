<template>
  <div class="container">
    <img :src="authStore.avatarUrl" alt="User Avatar" v-if="authStore.avatarUrl" />
    <div>
      <p>{{ authStore.username }}</p>
      <button @click="authStore.logout">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

img {
  width: 48px;
  height: 48px;
  object-fit: cover;
}
</style>
