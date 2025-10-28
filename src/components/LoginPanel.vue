<template>
  <div class="container">
    <a href="#" ref="loginButton">Login</a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

const loginButton = ref<HTMLAnchorElement | null>(null)

onMounted(() => {
  if (!loginButton.value) return

  const url = import.meta.env.VITE_API_URL + '/auth/login'

  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      loginButton.value.href = data.url
    })

  const mouseMoveElement = document.getElementsByClassName('mouse-move')[0] as HTMLElement
  if (!mouseMoveElement) return

  const rect = mouseMoveElement.getBoundingClientRect()
  const elementWidth = rect.width
  const elementHeight = rect.height
  const fixedX = rect.left
  const fixedY = rect.top

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

    const dist = distance(e.clientX, e.clientY, elementCenterX, elementCenterY) / 15

    if (dist) {
      const offsetX = (elementCenterX - e.clientX) / (dist * dist)
      const offsetY = (elementCenterY - e.clientY) / (dist * dist)

      const newLeft = mouseMoveElement.offsetLeft + offsetX
      const newTop = mouseMoveElement.offsetTop + offsetY

      mouseMoveElement.style.left = `${newLeft}px`
      mouseMoveElement.style.top = `${newTop}px`
    }

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
