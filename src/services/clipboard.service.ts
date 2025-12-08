/**
 * 剪贴板服务
 * 负责复制文本到剪贴板
 */

class ClipboardService {
  /**
   * 复制文本到剪贴板
   */
  async copy(text: string): Promise<boolean> {
    try {
      // 优先使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      }

      // 降级方案：使用传统 execCommand
      return this.fallbackCopy(text)
    } catch (error) {
      console.error('复制失败:', error)
      return false
    }
  }

  /**
   * 降级复制方案
   */
  private fallbackCopy(text: string): boolean {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.opacity = '0'
    
    document.body.appendChild(textarea)
    textarea.select()
    
    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      return successful
    } catch (error) {
      document.body.removeChild(textarea)
      return false
    }
  }

  /**
   * 读取剪贴板内容
   */
  async read(): Promise<string | null> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        const text = await navigator.clipboard.readText()
        return text
      }
      return null
    } catch (error) {
      console.error('读取剪贴板失败:', error)
      return null
    }
  }
}

export const clipboardService = new ClipboardService()
