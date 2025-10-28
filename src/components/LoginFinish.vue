<template>
  <div class="container">
    <img src="/successful_login.jpg" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const debug = ref<HTMLElement | null>(null)

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')

  const url = import.meta.env.VITE_API_URL + '/auth/getuser?code=' + code + '&state=' + state

  const response = await fetch(url)
  if (response.ok) {
    const data = await response.json()
    console.log(data)
    const authStore = useAuthStore()
    authStore.setAuthData(data)

    window.location.href = '/'
  } else {
    console.error('Failed to fetch user data')
  }
})
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
