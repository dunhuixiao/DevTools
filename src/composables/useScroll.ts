import { ref, onMounted, onUnmounted } from 'vue'
import { scrollService } from '../services/scroll.service'

export function useScroll(threshold = 300) {
  const scrollY = ref(0)
  const showBackToTop = ref(false)
  let unwatch: (() => void) | null = null

  /**
   * 滚动到顶部
   */
  const scrollToTop = () => {
    scrollService.scrollToTop()
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    scrollService.scrollToBottom()
  }

  /**
   * 更新滚动状态
   */
  const updateScrollState = (position: { x: number; y: number }) => {
    scrollY.value = position.y
    showBackToTop.value = position.y > threshold
  }

  onMounted(() => {
    // 初始化滚动位置
    const position = scrollService.getScrollPosition()
    updateScrollState(position)

    // 监听滚动
    unwatch = scrollService.onScroll(updateScrollState)
  })

  onUnmounted(() => {
    if (unwatch) {
      unwatch()
    }
  })

  return {
    scrollY,
    showBackToTop,
    scrollToTop,
    scrollToBottom
  }
}
