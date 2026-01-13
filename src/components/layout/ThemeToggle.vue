<template>
  <n-button
    circle
    quaternary
    :title="themeTitle"
    @click="toggleTheme"
    class="hover:scale-110 active:scale-95 transition-transform duration-fast"
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
  return isDark.value ? '浅色模式' : '深色模式'
})
</script>

<style scoped>
/* ThemeToggle 组件样式已迁移到 Tailwind 类名 */
</style>
