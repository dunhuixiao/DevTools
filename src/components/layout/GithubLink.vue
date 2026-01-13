<template>
  <n-button
    circle
    quaternary
    tag="a"
    href="https://github.com/dunhuixiao/DevTools"
    target="_blank"
    rel="noopener noreferrer"
    title="GitHub"
    class="hover:scale-110 active:scale-95 transition-transform duration-fast"
  >
    <template #icon>
      <n-icon :size="20">
        <LogoGithub />
      </n-icon>
    </template>
  </n-button>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { LogoGithub } from '@vicons/ionicons5'
</script>

<style scoped>
/* GithubLink 组件样式已迁移到 Tailwind 类名 */
</style>
