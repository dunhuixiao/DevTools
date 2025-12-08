<template>
  <n-button
    circle
    quaternary
    tag="a"
    href="https://github.com/dunhuixiao/DevTools"
    target="_blank"
    rel="noopener noreferrer"
    title="GitHub"
    class="github-link"
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
</style>
