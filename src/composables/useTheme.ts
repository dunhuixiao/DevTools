import { ref, computed, nextTick, watch } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme } from 'naive-ui'

// localStorage 键名
const STORAGE_KEY = 'dev-tools-theme-mode'

/**
 * 从 localStorage 读取主题偏好
 * @returns 'dark' | 'light'
 */
const getStoredTheme = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark'
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
    return false
  }
}

/**
 * 保存主题偏好到 localStorage
 * @param isDark 是否为暗黑模式
 */
const saveTheme = (isDark: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

// 全局共享的主题状态 - 从 localStorage 初始化
const isDark = ref(getStoredTheme())

// 监听跨标签页的主题变化
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      isDark.value = e.newValue === 'dark'
    }
  })
}

export function useTheme() {
  // 监听主题变化并保存到 localStorage
  watch(isDark, (newVal) => {
    saveTheme(newVal)
  })
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
   * 自动保存到 localStorage 并同步到其他标签页
   */
  const toggleTheme = async () => {
    // 添加禁用过渡的全局样式
    const style = document.createElement('style')
    style.id = 'disable-transitions'
    style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }'
    document.head.appendChild(style)

    // 切换主题（会自动触发 watch 保存到 localStorage）
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

  /**
   * 直接设置主题（用于初始化或跨标签页同步）
   * @param dark 是否为暗黑模式
   */
  const setTheme = async (dark: boolean) => {
    if (isDark.value === dark) return
    await toggleTheme()
  }

  return {
    isDark,
    naiveTheme,
    themeOverrides,
    toggleTheme,
    setTheme
  }
}
