<script setup lang="ts">
import type { SrlNavigationItem } from '#imports'

defineProps<{ mainNavigation: SrlNavigationItem[] }>()
</script>

<template>
  <main id="srl-page-main" tabindex="-1">
    <PagePrevNext>
      <NuxtPage />
    </PagePrevNext>
  </main>
</template>

<style lang="scss">
@use 'srl';
#srl-page-main {
  padding-top: calc( srl.system-root-style(srl-header-height) + srl.spacer-get(800) );
  min-height: 100dvh;
  &:has(.srl-article-root [class*='hero']:first-child),
  &:has(.srl-article-root [class*='background']:first-child)
  {
    padding-top: srl.system-root-style(srl-header-height);
  }
}
</style>
