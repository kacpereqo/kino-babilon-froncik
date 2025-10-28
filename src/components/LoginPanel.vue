<template>
  <div class="container">
    <a href="#" class="mouse-move" ref="loginButton">Login</a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loginButton = ref<HTMLAnchorElement | null>(null)

onMounted(() => {
  const url = import.meta.env.VITE_API_URL + '/auth/login'

  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      if (loginButton.value) loginButton.value.href = data.url
    })
})
</script>
