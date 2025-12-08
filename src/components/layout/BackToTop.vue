<template>
  <Transition name="fade">
    <n-button
      v-if="showBackToTop"
      circle
      type="primary"
      size="large"
      title="回到顶部"
      class="back-to-top"
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
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: var(--z-index-back-to-top);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 767px) {
  .back-to-top {
    right: 20px;
    bottom: 20px;
  }
}
</style>
