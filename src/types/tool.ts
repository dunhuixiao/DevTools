import type { Component } from 'vue'

// 扩展 vue-router 的 RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 工具分类 */
    category?: string
    /** 菜单图标 */
    icon?: string
    /** 是否缓存组件 */
    keepAlive?: boolean
    /** 是否在菜单中隐藏 */
    hideInMenu?: boolean
  }
}

/**
 * 工具元数据接口
 */
export interface ToolMeta {
  /** 工具唯一标识 */
  id: string
  /** 工具名称 */
  name: string
  /** 工具描述 */
  description: string
  /** 工具分类 */
  category: ToolCategory
  /** 工具图标 */
  icon: string
  /** 工具组件 */
  component: Component
  /** 路由路径 */
  route: string
  /** 搜索标签 */
  tags: string[]
  /** 显示顺序 */
  order: number
}

/**
 * 工具分类
 */
export type ToolCategory = 'json' | 'sql' | 'encode' | 'time' | 'text' | 'crypto' | 'image' | 'debug'
