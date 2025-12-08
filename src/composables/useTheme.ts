import { ref, computed, nextTick } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme } from 'naive-ui'

// 全局共享的主题状态
const isDark = ref(false)

export function useTheme() {
  // Naive UI 主题配置
  const naiveTheme = computed(() => {
    return isDark.value ? darkTheme : null
  })

  // 主题覆盖配置
  const themeOverrides = computed<GlobalThemeOverrides>(() => ({
    common: {
      primaryColor: '#18a058',
      primaryColorHover: '#36ad6a',
      primaryColorPressed: '#0c7a43',
      primaryColorSuppl: '#36ad6a',
      // 禁用组件内部的过渡动画，避免主题切换时的不同步
      cubicBezierEaseInOut: 'cubic-bezier(0, 0, 1, 1)',
      cubicBezierEaseOut: 'cubic-bezier(0, 0, 1, 1)',
      cubicBezierEaseIn: 'cubic-bezier(0, 0, 1, 1)'
    }
  }))

  /**
   * 切换主题
   * 临时禁用过渡动画，确保整个页面同步切换
   */
  const toggleTheme = async () => {
    // 添加禁用过渡的全局样式
    const style = document.createElement('style')
    style.id = 'disable-transitions'
    style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }'
    document.head.appendChild(style)

    // 切换主题
    isDark.value = !isDark.value

    // 等待 Vue 完成 DOM 更新
    await nextTick()
    
    // 再等待渲染完成后移除禁用样式
    setTimeout(() => {
      const styleEl = document.getElementById('disable-transitions')
      if (styleEl) {
        styleEl.remove()
      }
    }, 0)
  }

  return {
    isDark,
    naiveTheme,
    themeOverrides,
    toggleTheme
  }
}
