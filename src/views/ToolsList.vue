<template>
  <div class="home-container">
    <div class="hero-section">
      <n-icon :size="48" color="#18a058">
        <ConstructOutline />
      </n-icon>
      <h1 class="hero-title">开发工具箱</h1>
      <p class="hero-description">
        面向开发者的在线工具集平台
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
            <n-tag :type="tool.type as 'success' | 'info'" size="small" class="tool-tag">{{ tool.category }}</n-tag>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NIcon, NCard, NGrid, NGridItem, NTag } from 'naive-ui'
import { 
  ConstructOutline, 
  CodeSlashOutline, 
  ServerOutline 
} from '@vicons/ionicons5'

const router = useRouter()

// 工具列表（示例）
const tools = [
  {
    id: 'json-tools',
    name: 'JSON 工具',
    description: '提供 JSON 格式化、压缩、转义/反转义功能',
    category: 'JSON 工具',
    icon: CodeSlashOutline,
    route: '/json',
    type: 'success'
  },
  {
    id: 'sql-tools',
    name: 'SQL 工具',
    description: '提供 SQL 数据填充等实用功能',
    category: 'SQL 工具',
    icon: ServerOutline,
    route: '/sql',
    type: 'info'
  }
]

const navigateToTool = (route: string) => {
  router.push(route)
}
</script>

<style scoped>
.home-container {
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

.tool-tag {
  margin-top: var(--spacing-xs);
}

@media (max-width: 767px) {
  .home-container {
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
