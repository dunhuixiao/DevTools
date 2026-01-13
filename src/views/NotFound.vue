<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-124px)] p-2xl sm:p-lg">
    <n-result
      status="404"
      title="404 页面未找到"
      :description="`抱歉，您访问的功能暂未上线或地址有误。`"
    >
      <template #footer>
        <n-space vertical :size="16">
          <n-button type="primary" @click="goHome">
            返回首页
          </n-button>
          <n-text depth="3" class="text-sm">
            {{ countdown > 0 ? `${countdown} 秒后自动返回首页` : '' }}
          </n-text>
        </n-space>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { NResult, NButton, NSpace, NText } from 'naive-ui'

const router = useRouter()
const countdown = ref(5)
let timer: number | null = null

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
/* NotFound 页面样式已迁移到 Tailwind 类名 */
</style>
