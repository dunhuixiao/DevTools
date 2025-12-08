<template>
  <div class="not-found-container">
    <n-result
      status="404"
      title="404 页面未找到"
      :description="`抱歉，您访问的页面 ${currentPath} 不存在`"
    >
      <template #footer>
        <n-space vertical :size="16">
          <n-button type="primary" @click="goHome">
            返回首页
          </n-button>
          <n-text depth="3" class="tip-text">
            {{ countdown > 0 ? `${countdown} 秒后自动返回首页` : '' }}
          </n-text>
        </n-space>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NResult, NButton, NSpace, NText } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const countdown = ref(5)
let timer: number | null = null

const currentPath = ref(route.path)

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  // 倒计时自动返回首页
  timer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      goHome()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  padding: var(--spacing-2xl);
}

.tip-text {
  font-size: var(--font-size-sm);
}
</style>
