import { ref } from 'vue'
import { clipboardService } from '../services/clipboard.service'
import { useMessage } from 'naive-ui'

export function useClipboard() {
  const message = useMessage()
  const copying = ref(false)

  /**
   * 复制文本到剪贴板
   */
  const copy = async (text: string, showMessage = true) => {
    if (!text) {
      if (showMessage) {
        message.warning('没有内容可复制')
      }
      return false
    }

    copying.value = true
    const success = await clipboardService.copy(text)
    copying.value = false

    if (showMessage) {
      if (success) {
        message.success('复制成功')
      } else {
        message.error('复制失败，请手动复制')
      }
    }

    return success
  }

  /**
   * 读取剪贴板内容
   */
  const read = async () => {
    return await clipboardService.read()
  }

  return {
    copying,
    copy,
    read
  }
}
