<template>
  <div class="tool-container">
    <n-card title="SQL 数据填充" :segmented="{ content: true }" class="tool-card">
      <n-space vertical :size="16" style="height: 100%; display: flex; flex-direction: column;">
        <n-alert type="info" title="使用说明">
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>在 SQL 模板中使用 <code>?</code> 作为占位符</li>
            <li>参数支持两种格式：
              <ul style="margin-top: 4px;">
                <li><strong>带类型标注</strong>: 值(类型)，如 <code>1425644204015037522(Long)</code></li>
                <li><strong>简单值</strong>: 直接输入，系统自动推断类型</li>
              </ul>
            </li>
            <li>支持的类型: String, Long, Integer, Boolean, Null, Date, Array</li>
            <li><strong>注意</strong>: Long 类型会保持完整精度，避免 JavaScript 数字精度丢失</li>
          </ul>
        </n-alert>

        <n-form-item label="SQL 模板（填充后将覆盖此处）" style="flex: 1; display: flex; flex-direction: column;">
          <n-input
            ref="sqlInputRef"
            v-model:value="sqlTemplate"
            type="textarea"
            placeholder="请输入 SQL 模板，使用 ? 作为占位符&#10;示例: SELECT * FROM users WHERE id = ? AND name = ? AND age > ?"
            style="flex: 1;"
            :autosize="false"
            @keydown="handleSqlKeydown"
          />
        </n-form-item>

        <n-form-item label="参数列表（每行一个参数）" style="flex: 1; display: flex; flex-direction: column;">
          <n-input
            ref="paramInputRef"
            v-model:value="parameters"
            type="textarea"
            placeholder="请输入参数，每行一个&#10;示例:&#10;1425644204015037522(Long)&#10;张三&#10;18"
            style="flex: 1;"
            :autosize="false"
            @keydown="handleParamKeydown"
          />
        </n-form-item>

        <n-space>
          <n-button type="primary" @click="handleFill">填充</n-button>
          <n-button @click="handleClear">清空</n-button>
          <n-button @click="handleCopy" :disabled="!sqlTemplate">复制 SQL</n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NSpace, NFormItem, NInput, NButton, NAlert, useMessage } from 'naive-ui'
import { useClipboard } from '../../composables/useClipboard'

const message = useMessage()
const { copy } = useClipboard()

const sqlTemplate = ref('')
const parameters = ref('')

// 历史记录栈 - 分别为 SQL 和参数维护
const sqlHistory = ref<string[]>([])
const sqlHistoryIndex = ref(-1)
const paramHistory = ref<string[]>([])
const paramHistoryIndex = ref(-1)

// 当前获取焦点的输入框
let lastFocusedInput: 'sql' | 'param' = 'sql'

// 添加 SQL 历史记录
const addSqlHistory = (value: string) => {
  sqlHistory.value = sqlHistory.value.slice(0, sqlHistoryIndex.value + 1)
  sqlHistory.value.push(value)
  sqlHistoryIndex.value = sqlHistory.value.length - 1
}

// 添加参数历史记录
const addParamHistory = (value: string) => {
  paramHistory.value = paramHistory.value.slice(0, paramHistoryIndex.value + 1)
  paramHistory.value.push(value)
  paramHistoryIndex.value = paramHistory.value.length - 1
}

// 撤销
const handleUndo = () => {
  if (lastFocusedInput === 'sql' && sqlHistoryIndex.value > 0) {
    sqlHistoryIndex.value--
    const value = sqlHistory.value[sqlHistoryIndex.value]
    if (value !== undefined) {
      sqlTemplate.value = value
    }
  } else if (lastFocusedInput === 'param' && paramHistoryIndex.value > 0) {
    paramHistoryIndex.value--
    const value = paramHistory.value[paramHistoryIndex.value]
    if (value !== undefined) {
      parameters.value = value
    }
  }
}

// 重做
const handleRedo = () => {
  if (lastFocusedInput === 'sql' && sqlHistoryIndex.value < sqlHistory.value.length - 1) {
    sqlHistoryIndex.value++
    const value = sqlHistory.value[sqlHistoryIndex.value]
    if (value !== undefined) {
      sqlTemplate.value = value
    }
  } else if (lastFocusedInput === 'param' && paramHistoryIndex.value < paramHistory.value.length - 1) {
    paramHistoryIndex.value++
    const value = paramHistory.value[paramHistoryIndex.value]
    if (value !== undefined) {
      parameters.value = value
    }
  }
}

// 键盘快捷键 - SQL 输入框
const handleSqlKeydown = (e: KeyboardEvent) => {
  lastFocusedInput = 'sql'
  if (e.ctrlKey || e.metaKey) {
    if ((e.shiftKey && (e.key === 'Z' || e.key === 'z')) || e.key === 'y' || e.key === 'Y') {
      e.preventDefault()
      handleRedo()
    } else if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault()
      handleUndo()
    }
  }
}

// 键盘快捷键 - 参数输入框
const handleParamKeydown = (e: KeyboardEvent) => {
  lastFocusedInput = 'param'
  if (e.ctrlKey || e.metaKey) {
    if ((e.shiftKey && (e.key === 'Z' || e.key === 'z')) || e.key === 'y' || e.key === 'Y') {
      e.preventDefault()
      handleRedo()
    } else if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault()
      handleUndo()
    }
  }
}

// 参数类型定义
type ParamType = 'String' | 'Long' | 'Integer' | 'Boolean' | 'Null' | 'Date' | 'Array'

interface ParsedParam {
  value: string
  type: ParamType
}

/**
 * 解析参数 - 支持类型标注格式和自动推断
 */
const parseParameter = (param: string): ParsedParam => {
  const trimmed = param.trim()
  
  // 检查是否有类型标注 格式: 值(类型)
  const typeMatch = trimmed.match(/^(.+?)\((\w+)\)$/)
  
  if (typeMatch) {
    const [, value = '', type = 'String'] = typeMatch
    return {
      value: value.trim(),
      type: type as ParamType
    }
  }
  
  // 自动推断类型
  if (trimmed.toLowerCase() === 'null') {
    return { value: trimmed, type: 'Null' }
  }
  
  if (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false') {
    return { value: trimmed, type: 'Boolean' }
  }
  
  if (/^-?\d+$/.test(trimmed)) {
    const num = BigInt(trimmed)
    // 判断是否超出 JavaScript 安全整数范围
    if (num > BigInt(Number.MAX_SAFE_INTEGER) || num < BigInt(Number.MIN_SAFE_INTEGER)) {
      return { value: trimmed, type: 'Long' }
    }
    return { value: trimmed, type: 'Integer' }
  }
  
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return { value: trimmed, type: 'Date' }
  }
  
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return { value: trimmed, type: 'Array' }
  }
  
  // 默认为字符串
  return { value: trimmed, type: 'String' }
}

/**
 * 格式化参数值
 */
const formatParameter = (parsed: ParsedParam): string => {
  const { value, type } = parsed
  
  switch (type) {
    case 'String':
      // 转义单引号
      return `'${value.replace(/'/g, "''")}'`
    
    case 'Long':
    case 'Integer':
      // 数字类型直接输出，不加引号，保持精度
      return value
    
    case 'Boolean':
      return value.toLowerCase() === 'true' ? '1' : '0'
    
    case 'Null':
      return 'NULL'
    
    case 'Date':
      return `'${value}'`
    
    case 'Array':
      try {
        const arr = JSON.parse(value)
        return arr.map((item: any) => {
          if (typeof item === 'string') {
            return `'${item.replace(/'/g, "''")}'`
          }
          return item
        }).join(', ')
      } catch {
        return value
      }
    
    default:
      return `'${value}'`
  }
}

const handleFill = () => {
  if (!sqlTemplate.value.trim()) {
    message.warning('请输入 SQL 模板')
    return
  }
  
  if (!parameters.value.trim()) {
    message.warning('请输入参数列表')
    return
  }
  
  try {
    // 填充前保存 SQL 历史
    addSqlHistory(sqlTemplate.value)
    
    // 解析参数列表
    const paramLines = parameters.value.split('\n').filter(line => line.trim())
    const parsedParams = paramLines.map(parseParameter)
    
    // 统计占位符数量
    const placeholderCount = (sqlTemplate.value.match(/\?/g) || []).length
    
    if (parsedParams.length !== placeholderCount) {
      message.error(`参数数量不匹配: SQL 模板需要 ${placeholderCount} 个参数，但提供了 ${parsedParams.length} 个`)
      return
    }
    
    // 替换占位符，直接覆盖 SQL 模板框
    let result = sqlTemplate.value
    parsedParams.forEach(param => {
      result = result.replace('?', formatParameter(param))
    })
    
    sqlTemplate.value = result
    message.success('填充成功，结果已覆盖到 SQL 模板框')
  } catch (error) {
    message.error(`填充失败: ${(error as Error).message}`)
  }
}

const handleClear = () => {
  if (sqlTemplate.value) {
    addSqlHistory(sqlTemplate.value)
  }
  if (parameters.value) {
    addParamHistory(parameters.value)
  }
  sqlTemplate.value = ''
  parameters.value = ''
}

const handleCopy = async () => {
  if (sqlTemplate.value) {
    await copy(sqlTemplate.value)
  }
}
</script>

<style scoped>
.tool-container {
  padding: var(--spacing-base);
  max-width: 100%;
  width: 100%;
  margin: 0;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.tool-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-card :deep(.n-card__content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tool-card :deep(.n-form-item-blank) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tool-card :deep(.n-input-wrapper) {
  height: 100%;
}

.tool-card :deep(.n-input__textarea-el) {
  height: 100%;
  resize: none;
}

code {
  background-color: rgba(150, 150, 150, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: var(--font-family-mono);
  font-size: 0.9em;
}

ul {
  line-height: 1.8;
}

ul ul {
  margin-top: 4px;
}

:deep(textarea) {
  font-family: var(--font-family-mono);
  font-size: 14px;
  line-height: 1.6;
  resize: none !important;
}
</style>
