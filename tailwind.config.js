/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 颜色系统
      colors: {
        primary: {
          DEFAULT: '#18a058',
          hover: '#36ad6a',
          pressed: '#0c7a43',
        },
      },
      // 字体系统
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'Consolas',
          'Courier New',
          'monospace',
        ],
      },
      // 字体大小
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '7xl': '72px',
        '9xl': '128px',
      },
      // 间距系统
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        base: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      // 圆角系统
      borderRadius: {
        sm: '3px',
        DEFAULT: '6px',
        lg: '12px',
      },
      // 阴影系统
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 16px rgba(0, 0, 0, 0.15)',
        '2xl': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      // 过渡时长
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '300ms',
        slow: '500ms',
      },
      // 过渡时间函数
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // 布局尺寸
      height: {
        header: '64px',
        footer: '60px',
      },
      width: {
        sidebar: '240px',
        'sidebar-collapsed': '64px',
      },
      // Z-index 层级
      zIndex: {
        base: '1',
        header: '100',
        sidebar: '90',
        'back-to-top': '999',
        modal: '1000',
        notification: '2000',
      },
      // 响应式断点
      screens: {
        xs: '576px',
        sm: '768px',
        md: '1024px',
        lg: '1440px',
      },
    },
  },
  plugins: [],
  // 保护第三方库的类名
  safelist: [
    'vjs-tree',
    'vjs-key',
    'vjs-value',
  ],
}
