<template>
  <n-layout-header bordered class="app-header">
    <div class="header-container">
      <!-- 左侧：Logo 和标题 -->
      <div class="header-left">
        <router-link to="/" class="logo-link">
          <n-icon :size="28" color="#18a058">
            <ConstructOutline />
          </n-icon>
          <h1 class="app-title">开发工具箱</h1>
        </router-link>
      </div>

      <!-- 中间：导航菜单 -->
      <div class="header-center">
        <n-menu
          mode="horizontal"
          :value="activeKey"
          :options="menuOptions"
          @update:value="handleMenuSelect"
        />
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="header-right">
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
import { ConstructOutline, CodeSlashOutline, ServerOutline } from '@vicons/ionicons5'
import ThemeToggle from './ThemeToggle.vue'
import GithubLink from './GithubLink.vue'

const router = useRouter()
const route = useRoute()

const activeKey = computed(() => route.path)

const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: 'JSON 工具',
    key: '/json',
    icon: renderIcon(CodeSlashOutline)
  },
  {
    label: 'SQL 工具',
    key: '/sql',
    icon: renderIcon(ServerOutline)
  }
]

const handleMenuSelect = (key: string) => {
  if (key && key.startsWith('/')) {
    router.push(key)
  }
}
</script>

<style scoped>
.app-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: var(--z-index-header);
}

.header-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  flex: 0 0 auto;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
  color: inherit;
  transition: opacity var(--transition-fast);
}

.logo-link:hover {
  opacity: 0.8;
}

.app-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 var(--spacing-lg);
  overflow-x: auto;
  overflow-y: hidden;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .header-center {
    margin: 0 var(--spacing-sm);
  }
  
  .app-title {
    display: none;
  }
}

.header-right {
  flex: 0 0 auto;
}

@media (max-width: 767px) {
  .app-header {
    padding: 0 var(--spacing-base);
  }

  .app-title {
    font-size: var(--font-size-base);
  }
}
</style>
