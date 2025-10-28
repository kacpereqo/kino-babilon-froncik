<template>
  <div id="app">
    <Scaffolding />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Scaffolding from './components/Scaffolding.vue'

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

onMounted(() => {
  if (Math.random() > 0.5) return

  const allElements = Array.from(document.querySelectorAll('*')) as HTMLElement[]
  if (allElements.length === 0) return

  const mouseMoveElement = allElements[Math.floor(Math.random() * allElements.length)]
  mouseMoveElement.classList.add('mouse-move')

  if (!mouseMoveElement) return

  // ✅ 2. Get element position & size
  const rect = mouseMoveElement.getBoundingClientRect()
  const elementWidth = rect.width
  const elementHeight = rect.height
  const fixedX = rect.left
  const fixedY = rect.top

  // ✅ 3. Create placeholder to preserve layout
  const placeholder = document.createElement('div')
  placeholder.style.width = `${elementWidth}px`
  placeholder.style.height = `${elementHeight}px`
  placeholder.style.display = 'inline-block'
  mouseMoveElement.parentNode?.insertBefore(placeholder, mouseMoveElement)

  // ✅ 4. Move element to fixed overlay
  mouseMoveElement.style.width = `${elementWidth}px`
  mouseMoveElement.style.height = `${elementHeight}px`
  mouseMoveElement.style.position = 'fixed'
  mouseMoveElement.style.left = `${fixedX}px`
  mouseMoveElement.style.top = `${fixedY}px`
  mouseMoveElement.style.zIndex = '1000'

  // ✅ 5. Distance helper
  function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  }

  // ✅ 6. Mouse move logic
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

    // ✅ Screen edge wrap-around
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

<style>
@import url('/styles/variables.css');
@import url('/styles/global.css');
</style>
