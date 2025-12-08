<template>
  <n-layout-footer bordered class="footer">
    <n-text depth="3" class="copyright-text">
      Copyright © 2025 - present 
      <a href="https://github.com/dunhuixiao" target="_blank" rel="noopener noreferrer" class="author-link">Sora</a>
    </n-text>
  </n-layout-footer>
</template>

<script setup lang="ts">
import { NLayoutFooter, NText } from 'naive-ui'
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--footer-height);
  padding: var(--spacing-lg);
  text-align: center;
}

.copyright-text {
  font-size: var(--font-size-sm);
}

.author-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.author-link:hover {
  color: var(--primary-color-hover);
  text-decoration: underline;
}

@media (max-width: 767px) {
  .footer {
    min-height: auto;
    padding: var(--spacing-base);
  }

  .copyright-text {
    font-size: var(--font-size-xs);
  }
}
</style>
