<template>
  <div class="p-base w-full h-[calc(100vh-120px)] overflow-hidden">
    <n-card title="JSON 格式化" :segmented="{ content: true }" class="h-full flex flex-col">
      <template #header-extra>
        <n-space>
          <n-button type="primary" size="small" @click="handleFormat"
            >格式化</n-button
          >
          <n-button type="primary" size="small" @click="handleCompress"
            >压缩</n-button
          >
          <n-button type="primary" size="small" @click="handleEscape"
            >转义</n-button
          >
          <n-button type="primary" size="small" @click="handleUnescape"
            >反转义</n-button
          >
          <n-button size="small" @click="handleCopy" :disabled="!content"
            >复制</n-button
          >
          <n-button size="small" @click="handleClear">清空</n-button>
        </n-space>
      </template>

      <n-grid :cols="2" :x-gap="16" class="json-grid">
        <n-grid-item class="flex flex-col h-full min-h-0">
          <div class="text-sm font-medium mb-2">输入编辑</div>
          <n-input
            ref="inputRef"
            v-model:value="content"
            type="textarea"
            placeholder="请输入 JSON 字符串或内容..."
            :autosize="false"
            :resizable="false"
            class="flex-1 min-h-0 flex flex-col"
            @keydown="handleKeydown"
            @wheel.stop
          />
        </n-grid-item>

        <n-grid-item class="flex flex-col h-full min-h-0">
          <div class="text-sm font-medium mb-2">结构预览</div>
          <div class="flex-1 min-h-0 overflow-auto border rounded p-3" @wheel.stop>
            <vue-json-pretty
              v-if="parsedJson !== null"
              :data="parsedJson"
              :deep="Infinity"
              :showLength="true"
              :showLine="false"
              :showDoubleQuotes="true"
            />
            <n-empty
              v-else-if="!content.trim()"
              description="请输入 JSON 内容"
              style="margin-top: 100px"
            />
            <n-alert
              v-else
              type="error"
              title="JSON 解析失败"
              style="margin-top: 20px"
            >
              {{ parseError }}
            </n-alert>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  NCard,
  NSpace,
  NGrid,
  NGridItem,
  NInput,
  NButton,
  NEmpty,
  useMessage,
} from "naive-ui";
import { useClipboard } from "../../composables/useClipboard";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const message = useMessage();
const { copy } = useClipboard();

const content = ref("");

// 历史记录栈
const history = ref<string[]>([]);
const historyIndex = ref(-1);

// 是否可以撤销/重做
const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);

// JSON 解析
const parsedJson = ref<any>(null);
const parseError = ref("");

// 实时解析 JSON
watch(
  content,
  (newContent) => {
    if (!newContent.trim()) {
      parsedJson.value = null;
      parseError.value = "";
      return;
    }

    try {
      parsedJson.value = JSON.parse(newContent);
      parseError.value = "";
    } catch (error) {
      parsedJson.value = null;
      parseError.value = (error as Error).message;
    }
  },
  { immediate: true }
);

// 添加历史记录
const addHistory = (value: string) => {
  // 移除当前位置之后的所有历史
  history.value = history.value.slice(0, historyIndex.value + 1);
  // 添加新记录
  history.value.push(value);
  historyIndex.value = history.value.length - 1;
};

// 撤销
const handleUndo = () => {
  if (canUndo.value) {
    historyIndex.value--;
    const value = history.value[historyIndex.value];
    if (value !== undefined) {
      content.value = value;
    }
  }
};

// 重做
const handleRedo = () => {
  if (canRedo.value) {
    historyIndex.value++;
    const value = history.value[historyIndex.value];
    if (value !== undefined) {
      content.value = value;
    }
  }
};

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    // Ctrl+Shift+Z 或 Ctrl+Y 重做
    if (
      (e.shiftKey && (e.key === "Z" || e.key === "z")) ||
      e.key === "y" ||
      e.key === "Y"
    ) {
      e.preventDefault();
      handleRedo();
      return;
    }
    // Ctrl+Z 撤销（但不是 Ctrl+Shift+Z）
    if ((e.key === "z" || e.key === "Z") && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }
    // 其他快捷键（如 Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A 等）正常通过
  }
};

// JSON 格式化
const handleFormat = () => {
  if (!content.value.trim()) {
    message.warning("请输入 JSON 字符串");
    return;
  }

  try {
    // 只在操作前保存一次历史
    addHistory(content.value);

    const parsed = JSON.parse(content.value);
    content.value = JSON.stringify(parsed, null, 4);
    message.success("格式化成功");
  } catch (error) {
    message.error(`JSON 格式错误: ${(error as Error).message}`);
  }
};

// JSON 压缩
const handleCompress = () => {
  if (!content.value.trim()) {
    message.warning("请输入 JSON 字符串");
    return;
  }

  try {
    // 只在操作前保存一次历史
    addHistory(content.value);

    const parsed = JSON.parse(content.value);
    content.value = JSON.stringify(parsed);

    message.success("压缩成功");
  } catch (error) {
    message.error(`JSON 格式错误: ${(error as Error).message}`);
  }
};

// 转义
const handleEscape = () => {
  if (!content.value.trim()) {
    message.warning("请输入内容");
    return;
  }

  try {
    addHistory(content.value);

    // 累积转义逻辑：每次只添加一层转义
    // 关键：先标记已转义的内容，避免重复处理
    let result = content.value;
    
    // 使用临时占位符来保护已转义的内容
    const ESCAPED_BACKSLASH = '\x00ESCAPED_BACKSLASH\x00';
    const ESCAPED_QUOTE = '\x00ESCAPED_QUOTE\x00';
    
    // 1. 先标记已存在的转义序列（保护它们不被再次转义）
    result = result.replace(/\\\\/g, ESCAPED_BACKSLASH);
    result = result.replace(/\\"/g, ESCAPED_QUOTE);
    
    // 2. 现在转义剩余的未转义字符
    result = result.replace(/\\/g, '\\\\');  // 单个 \ -> \\
    result = result.replace(/"/g, '\\"');      // " -> \"
    
    // 3. 恢复之前标记的内容，并给它们也加一层转义
    result = result.replace(new RegExp(ESCAPED_BACKSLASH, 'g'), '\\\\\\\\');  // 已转义的 \\ -> \\\\
    result = result.replace(new RegExp(ESCAPED_QUOTE, 'g'), '\\\\"');          // 已转义的 \" -> \\"

    content.value = result;
    message.success("转义成功");
  } catch (error) {
    message.error(`转义失败: ${(error as Error).message}`);
  }
};

// 反转义
const handleUnescape = () => {
  if (!content.value.trim()) {
    message.warning("请输入内容");
    return;
  }

  try {
    addHistory(content.value);

    // 累积反转义逻辑：每次只移除一层转义符
    // 将所有 \\ 变成 \，将所有 \" 变成 "
    let result = content.value;
    
    // 使用占位符避免重复替换
    const TEMP_BACKSLASH = '\x00TEMP_BACKSLASH\x00';
    const TEMP_QUOTE = '\x00TEMP_QUOTE\x00';
    
    // 1. 先处理转义的引号 \" -> 临时标记
    result = result.replace(/\\"/g, TEMP_QUOTE);
    
    // 2. 再处理转义的反斜杠 \\ -> 临时标记
    result = result.replace(/\\\\/g, TEMP_BACKSLASH);
    
    // 3. 恢复标记为目标字符
    result = result.replace(new RegExp(TEMP_QUOTE, 'g'), '"');
    result = result.replace(new RegExp(TEMP_BACKSLASH, 'g'), '\\');

    content.value = result;
    message.success("反转义成功");
  } catch (error) {
    message.error(`反转义失败: ${(error as Error).message}`);
  }
};

const handleClear = () => {
  if (content.value) {
    addHistory(content.value);
    content.value = "";
  }
};

const handleCopy = async () => {
  if (content.value) {
    await copy(content.value);
  }
};
</script>

<style scoped>
/* JsonFormat 页面样式主要迁移到 Tailwind 类名 */

/* Naive UI 输入框深度定制 */
.flex-1 :deep(.n-input-wrapper) {
  flex: 1;
  height: 100%;
}

.flex-1 :deep(.n-input__textarea) {
  flex: 1;
  height: 100%;
}

.flex-1 :deep(.n-input__textarea-el),
.flex-1 :deep(textarea) {
  flex: 1;
  height: 100%;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: auto;
  min-height: 0 !important;
  resize: none !important;
}

/* 移除拖拽手柄 */
.flex-1 :deep(textarea::-webkit-resizer),
.flex-1 :deep(.n-input__textarea-el::-webkit-resizer) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

.flex-1 :deep(textarea),
.flex-1 :deep(.n-input__textarea-el) {
  resize: none !important;
  overflow: auto !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

/* 卡片内容布局 */
:deep(.n-card__content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.json-grid {
  height: 100%;
  min-height: 0;
}

/* JSON 树样式 */
:deep(.vjs-tree) {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 14px;
}
</style>
