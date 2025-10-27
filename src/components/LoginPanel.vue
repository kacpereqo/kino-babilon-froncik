<template>
  <div class="container">
    <button @click="openDiscordPopup">Zaloguj się</button>
  </div>
</template>

<script setup lang="ts">
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
        } catch (err) {}
      }, 500)
    })
}
</script>
