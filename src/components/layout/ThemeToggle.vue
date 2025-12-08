<template>
  <n-button
    circle
    quaternary
    :title="themeTitle"
    @click="toggleTheme"
    class="theme-toggle"
  >
    <template #icon>
      <n-icon :size="20">
        <component :is="themeIcon" />
      </n-icon>
    </template>
  </n-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5'
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const themeIcon = computed(() => {
  return isDark.value ? SunnyOutline : MoonOutline
})

const themeTitle = computed(() => {
  return isDark.value ? '切换到亮色模式' : '切换到暗色模式'
})
</script>

<style scoped>
</style>
