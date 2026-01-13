<template>
  <Transition name="fade">
    <n-button
      v-if="showBackToTop"
      circle
      type="primary"
      size="large"
      title="回到顶部"
      class="fixed right-10 bottom-10 z-back-to-top shadow-lg sm:right-5 sm:bottom-5"
      @click="scrollToTop"
    >
      <template #icon>
        <n-icon :size="24">
          <ArrowUp />
        </n-icon>
      </template>
    </n-button>
  </Transition>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { ArrowUp } from '@vicons/carbon'
import { useScroll } from '../../composables/useScroll'

const { showBackToTop, scrollToTop } = useScroll(300)
</script>

<style scoped>
/* BackToTop 组件样式已迁移到 Tailwind 类名 */
</style>
