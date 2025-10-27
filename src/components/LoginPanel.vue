<template>
  <div class="container">
    <button class="mouse-move" @click="openDiscordPopup">Zaloguj się</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

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

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

onMounted(() => {
  const mouseMoveElement = document.getElementsByClassName('mouse-move')[0] as HTMLElement
  if (!mouseMoveElement) return

  const rect = mouseMoveElement.getBoundingClientRect()
  const elementWidth = rect.width
  const elementHeight = rect.height
  const fixedX = rect.left
  const fixedY = rect.top

  // ✅ 1. Create placeholder to preserve layout
  const placeholder = document.createElement('div')
  placeholder.style.width = `${elementWidth}px`
  placeholder.style.height = `${elementHeight}px`
  placeholder.style.display = 'inline-block'
  mouseMoveElement.parentNode?.insertBefore(placeholder, mouseMoveElement)

  // ✅ 2. Move actual element to fixed position (overlay)
  mouseMoveElement.style.width = `${elementWidth}px`
  mouseMoveElement.style.height = `${elementHeight}px`
  mouseMoveElement.style.position = 'fixed'
  mouseMoveElement.style.left = `${fixedX}px`
  mouseMoveElement.style.top = `${fixedY}px`
  mouseMoveElement.style.zIndex = '1000'

  // ✅ 3. Movement logic
  window.addEventListener('mousemove', (e) => {
    const elementCenterX = mouseMoveElement.offsetLeft + elementWidth / 2
    const elementCenterY = mouseMoveElement.offsetTop + elementHeight / 2

    // 🔹 Distance now calculated from element center
    const dist = distance(e.clientX, e.clientY, elementCenterX, elementCenterY) / 15

    if (dist) {
      const offsetX = (elementCenterX - e.clientX) / (dist * dist)
      const offsetY = (elementCenterY - e.clientY) / (dist * dist)

      // Adjust position by keeping the element centered
      const newLeft = mouseMoveElement.offsetLeft + offsetX
      const newTop = mouseMoveElement.offsetTop + offsetY

      mouseMoveElement.style.left = `${newLeft}px`
      mouseMoveElement.style.top = `${newTop}px`
    }

    // ✅ 4. Screen wrap-around logic
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const left = mouseMoveElement.offsetLeft
    const top = mouseMoveElement.offsetTop

    if (left + elementWidth < 0) mouseMoveElement.style.left = `${screenWidth - 10}px`
    if (left > screenWidth) mouseMoveElement.style.left = `-${elementWidth - 10}px`
    if (top + elementHeight < 0) mouseMoveElement.style.top = `${screenHeight - 10}px`
    if (top > screenHeight) mouseMoveElement.style.top = `-${elementHeight - 10}px`
  })
})
</script>
