/**
 * 滚动服务
 * 负责页面滚动控制
 */

class ScrollService {
  /**
   * 平滑滚动到顶部
   */
  scrollToTop(smooth = true): void {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }

  /**
   * 平滑滚动到底部
   */
  scrollToBottom(smooth = true): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }

  /**
   * 滚动到指定元素
   */
  scrollToElement(element: HTMLElement, smooth = true): void {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start'
    })
  }

  /**
   * 获取当前滚动位置
   */
  getScrollPosition(): { x: number; y: number } {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    }
  }

  /**
   * 监听滚动事件
   */
  onScroll(callback: (position: { x: number; y: number }) => void): () => void {
    const handler = () => {
      callback(this.getScrollPosition())
    }

    window.addEventListener('scroll', handler, { passive: true })

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }
}

export const scrollService = new ScrollService()
