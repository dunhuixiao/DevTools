<template>
  <div class="nav-container">
    <div class="hero-section">
      <n-icon :size="48" color="#18a058">
        <ServerOutline />
      </n-icon>
      <h1 class="hero-title">SQL 工具</h1>
      <p class="hero-description">
        提供 SQL 数据填充等实用功能
      </p>
    </div>

    <div class="tools-section">
      <n-grid :x-gap="12" :y-gap="12" cols="1 640:2 1024:3 1280:4">
        <n-grid-item v-for="tool in tools" :key="tool.id">
          <n-card
            hoverable
            class="tool-card"
            @click="navigateToTool(tool.route)"
          >
            <div class="tool-icon">
              <n-icon :size="32" color="#18a058">
                <component :is="tool.icon" />
              </n-icon>
            </div>
            <h3 class="tool-name">{{ tool.name }}</h3>
            <p class="tool-description">{{ tool.description }}</p>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NIcon, NCard, NGrid, NGridItem } from 'naive-ui'
import { ServerOutline, DocumentTextOutline } from '@vicons/ionicons5'

const router = useRouter()

const tools = [
  {
    id: 'sql-fill',
    name: 'SQL 数据填充',
    description: '将参数值填充到 SQL 模板中',
    icon: DocumentTextOutline,
    route: '/sql/fill'
  }
]

const navigateToTool = (route: string) => {
  router.push(route)
}
</script>

<style scoped>
.nav-container {
  max-width: 100%;
  margin: 0;
  padding: var(--spacing-base) var(--spacing-lg);
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.hero-section {
  text-align: center;
  padding: var(--spacing-lg) 0 var(--spacing-base);
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  margin: var(--spacing-base) 0 var(--spacing-xs);
}

.hero-description {
  font-size: var(--font-size-base);
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.8;
}

.tools-section {
  margin-top: var(--spacing-base);
}

.tool-card {
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  height: 100%;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.tool-icon {
  margin-bottom: var(--spacing-base);
}

.tool-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: var(--spacing-xs) 0;
}

.tool-description {
  font-size: var(--font-size-xs);
  margin: var(--spacing-xs) 0;
  line-height: 1.4;
  opacity: 0.8;
}

@media (max-width: 767px) {
  .nav-container {
    padding: var(--spacing-base);
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-description {
    font-size: var(--font-size-sm);
  }
}
</style>
