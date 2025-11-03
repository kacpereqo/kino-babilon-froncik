<template>
  <div>
    <ul>
      <li>
        <span>Menu</span>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/calendar">Kalendarz</router-link></li>
          <li><router-link to="/admin">Admin</router-link></li>
          <li><router-link to="/citates">Złote myśli</router-link></li>
          <li><router-link to="/galeria">Galeria</router-link></li>
        </ul>
      </li>
      <li>
        <span>Socjale</span>
        <ul>
          <li><a href="https://db.zmitac.aei.polsl.pl/baza/st_login.html">Zmitac</a></li>
          <li><a href="https://bilard.kranus.pro/">Bliard Zmitac</a></li>
          <li><a href="https://www.facebook.com/KinoBabilon" target="_blank">Facebook</a></li>
          <li><a href="https://www.instagram.com/kinobabilon/" target="_blank">Instagram</a></li>
          <li>
            <a href="https://www.youtube.com/channel/UCV2J3q1u6b2H10k0r4YkZ9g" target="_blank"
              >YouTube</a
            >
          </li>
        </ul>
      </li>
      <li>
        <span>Admin panel</span>
        <ul>
          <li v-if="authStore.permissionLevel">Jestes adminem</li>
          <li v-else>NO BITCHS</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
ul li {
  margin-left: 20px;
}
</style>
