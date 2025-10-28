// src/stores/auth.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
/** Represents a user record returned from backend */
export interface DiscordUser {
  uid: number
  discord_id: string
  nickname: string
  permission_level: number
}

/** Represents the full OAuth login response */
export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: DiscordUser
}

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const user = ref<DiscordUser | null>(JSON.parse(localStorage.getItem('user') || 'null'))

  // --- Getters ---
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const username = computed(() => user.value?.nickname ?? 'Guest')
  const permissionLevel = computed(() => user.value?.permission_level ?? 0)
  const avatarUrl = computed(() => user.value?.avatar_url ?? '')

  // --- Actions ---
  function setAuthData(data: AuthResponse) {
    accessToken.value = data.access_token
    refreshToken.value = data.refresh_token
    user.value = data.user

    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    username,
    permissionLevel,
    setAuthData,
    logout,
    avatarUrl,
  }
})
