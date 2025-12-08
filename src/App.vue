<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-message-provider>
      <n-layout class="app-layout">
        <!-- 顶部导航栏 -->
        <AppHeader />

        <!-- 主内容区 -->
        <n-layout-content class="content-area">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </n-layout-content>

        <!-- 底部版权 -->
        <AppFooter />

        <!-- 回到顶部按钮 -->
        <BackToTop />
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NLayout, NLayoutContent, NGlobalStyle } from 'naive-ui'
import { useTheme } from './composables/useTheme'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import BackToTop from './components/layout/BackToTop.vue'

// 初始化主题，并获取主题配置
const { naiveTheme, themeOverrides } = useTheme()
</script>

<style>
@import './styles/global.css';

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}
</style>
