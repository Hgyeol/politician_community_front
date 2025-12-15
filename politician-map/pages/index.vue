<template>
  <ClientOnly>
    <div v-html="htmlContent"></div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const htmlContent = ref('')

onMounted(async () => {
  try {
    // Fetch the original HTML content
    const response = await fetch('/original.html')
    const html = await response.text()

    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    if (bodyMatch) {
      htmlContent.value = bodyMatch[1]
    }

    // Wait for DOM to update
    await nextTick()

    // Re-execute scripts after DOM is ready
    executeScripts()
  } catch (error) {
    console.error('Failed to load HTML:', error)
  }
})

function executeScripts() {
  // D3.js and other scripts are loaded via nuxt.config.ts
  // The map_zoom.js script will automatically run when the DOM is ready
  if (window.d3) {
    // Trigger DOMContentLoaded event for scripts that listen to it
    const event = new Event('DOMContentLoaded')
    document.dispatchEvent(event)
  }
}
</script>

<style>
/* Global styles are loaded from /app.css via nuxt.config.ts */
</style>
