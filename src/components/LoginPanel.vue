<template>
  <div class="container">
    <a href="#" @click="redirectToLogin">Login</a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

function redirectToLogin() {
  const url = import.meta.env.VITE_API_URL + '/auth/login'

  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      window.location.href = data.url
    })
}
</script>
