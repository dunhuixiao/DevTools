<template>
  <div class="tool-container">
    <n-card title="SQL 数据填充" :segmented="{ content: true }" class="tool-card">
      <template #header-extra>
        <n-space>
          <n-button size="small" @click="handleCopyResult" :disabled="!filledResult">复制结果</n-button>
          <n-button size="small" @click="handleClear">清空</n-button>
        </n-space>
      </template>

      <n-space vertical :size="12" style="height: 100%; display: flex; flex-direction: column;">
        <n-form-item label="SQL 模板" class="sql-form-item">
          <n-input
            ref="sqlInputRef"
            v-model:value="sqlTemplate"
            type="textarea"
            placeholder="请输入 SQL 模板，使用 ? 作为占位符&#10;示例: SELECT * FROM users WHERE id = ? AND name = ? AND age > ?"
            class="sql-input"
            :autosize="{ minRows: 5, maxRows: 10 }"
            @keydown="handleSqlKeydown"
            @wheel.stop
          />
        </n-form-item>

        <n-form-item label="参数列表（逗号分隔）" class="sql-form-item">
          <n-input
            ref="paramInputRef"
            v-model:value="parameters"
            type="textarea"
            placeholder="请输入参数，逗号分隔&#10;示例: 123(Long), 张三(String), 18(Integer)"
            class="sql-input"
            :autosize="{ minRows: 5, maxRows: 10 }"
            @keydown="handleParamKeydown"
            @blur="handleAutoFill"
            @wheel.stop
          />
        </n-form-item>

        <n-form-item label="填充结果" class="sql-form-item">
          <n-input
            v-model:value="filledResult"
            type="textarea"
            placeholder="填充结果将在此显示"
            class="sql-input"
            :autosize="{ minRows: 10, maxRows: 20 }"
            readonly
            @wheel.stop
          />
        </n-form-item>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NSpace, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { useClipboard } from '../../composables/useClipboard'

const message = useMessage()
const { copy } = useClipboard()

const sqlTemplate = ref('')
const parameters = ref('')
const filledResult = ref('')

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
type ParamType = 'String' | 'Long' | 'Integer' | 'Boolean' | 'Null' | 'Date' | 'Timestamp' | 'BigDecimal' | 'Array'

interface ParsedParam {
  value: string
  type: ParamType
}

/**
 * 解析参数 - 支持类型标注格式和自动推断
 */
const parseParameter = (param: string): ParsedParam => {
  const trimmed = param.trim()
  
  // 检查是否有类型标注 格式: 值(类型) 或 (类型) 表示空值
  const typeMatch = trimmed.match(/^(.*?)\((\w+)\)$/)
  
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
      // 空值处理
      if (!value) {
        return "''"
      }
      // 转义单引号
      return `'${value.replace(/'/g, "''")}'`
    
    case 'Long':
    case 'Integer':
    case 'BigDecimal':
      // 数字类型直接输出，不加引号，保持精度
      return value || '0'
    
    case 'Boolean':
      return value.toLowerCase() === 'true' ? '1' : '0'
    
    case 'Null':
      return 'NULL'
    
    case 'Date':
    case 'Timestamp':
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
    // 解析参数列表（逗号分隔）
    const paramItems = parameters.value.split(',').map(p => p.trim()).filter(p => p)
    const parsedParams = paramItems.map(parseParameter)
    
    // 统计占位符数量
    const placeholderCount = (sqlTemplate.value.match(/\?/g) || []).length
    
    if (parsedParams.length !== placeholderCount) {
      message.error(`参数数量不匹配: SQL 模板需要 ${placeholderCount} 个参数，但提供了 ${parsedParams.length} 个`)
      return
    }
    
    // 替换占位符，生成结果
    let result = sqlTemplate.value
    parsedParams.forEach(param => {
      result = result.replace('?', formatParameter(param))
    })
    
    filledResult.value = result
    message.success('填充成功')
  } catch (error) {
    message.error(`填充失败: ${(error as Error).message}`)
  }
}

// 参数输入框失焦时自动填充
const handleAutoFill = () => {
  if (sqlTemplate.value.trim() && parameters.value.trim()) {
    handleFill()
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
  filledResult.value = ''
}

const handleCopyResult = async () => {
  if (filledResult.value) {
    await copy(filledResult.value)
  }
}
</script>

<style scoped>
.tool-container {
  padding: var(--spacing-base);
  max-width: 100%;
  width: 100%;
  margin: 0;
  min-height: calc(100vh - 120px);
  overflow-y: auto;
}

.tool-card {
  height: auto;
  display: flex;
  flex-direction: column;
}

.tool-card :deep(.n-card__content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sql-form-item :deep(.n-form-item-blank) {
  display: flex;
  flex-direction: column;
}

.sql-input {
  display: flex;
  flex-direction: column;
}

.sql-input :deep(.n-input-wrapper) {
  width: 100%;
}

.sql-input :deep(.n-input__textarea) {
  width: 100%;
}

.sql-input :deep(.n-input__textarea-el),
.sql-input :deep(textarea) {
  resize: none !important;
  font-family: var(--font-family-mono);
  font-size: 14px;
  line-height: 1.6;
}

/* 彻底移除拖拽手柄 - 多种浏览器兼容 */
.sql-input :deep(textarea::-webkit-resizer),
.sql-input :deep(.n-input__textarea-el::-webkit-resizer) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

.sql-input :deep(textarea),
.sql-input :deep(.n-input__textarea-el) {
  resize: none !important;
  overflow: auto !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
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
}
</style>
