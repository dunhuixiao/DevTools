<template>
  <n-layout-header bordered class="flex items-center h-header sticky top-0 z-header px-lg">
    <div class="w-full max-w-[1600px] mx-auto flex items-center justify-between">
      <!-- 左侧：Logo 和标题 -->
      <div class="flex-shrink-0">
        <router-link to="/" class="flex items-center gap-md no-underline text-inherit hover:opacity-80 transition-opacity duration-fast">
          <n-icon :size="28" color="#18a058">
            <ConstructOutline />
          </n-icon>
          <h1 class="text-lg font-semibold m-0 hidden sm:block">开发工具箱</h1>
        </router-link>
      </div>

      <!-- 中间：导航菜单 -->
      <div class="flex-1 flex justify-center mx-lg overflow-x-auto overflow-y-hidden sm:mx-sm">
        <n-menu
          mode="horizontal"
          :value="activeKey"
          :options="menuOptions"
          @update:value="handleMenuSelect"
        />
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="flex-shrink-0">
        <n-space :size="12">
          <ThemeToggle />
          <GithubLink />
        </n-space>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayoutHeader, NIcon, NSpace, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { ConstructOutline, CodeSlashOutline, ServerOutline, DocumentTextOutline } from '@vicons/ionicons5'
import ThemeToggle from './ThemeToggle.vue'
import GithubLink from './GithubLink.vue'

const router = useRouter()
const route = useRoute()

// 计算当前激活的菜单项
const activeKey = computed(() => {
  const path = route.path
  // 返回完整路径以匹配子菜单项
  return path
})

const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: 'JSON 工具',
    key: 'json',
    icon: renderIcon(CodeSlashOutline),
    children: [
      {
        label: 'JSON 格式化',
        key: '/json/format',
        icon: renderIcon(DocumentTextOutline)
      }
    ]
  },
  {
    label: 'SQL 工具',
    key: 'sql',
    icon: renderIcon(ServerOutline),
    children: [
      {
        label: 'SQL 数据填充',
        key: '/sql/fill',
        icon: renderIcon(DocumentTextOutline)
      }
    ]
  }
]

const handleMenuSelect = (key: string) => {
  if (key && key.startsWith('/')) {
    router.push(key)
  }
}
</script>

<style scoped>
/* AppHeader 组件样式已迁移到 Tailwind 类名 */
</style>
