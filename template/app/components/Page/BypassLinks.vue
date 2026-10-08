<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SrlNavigationItem } from '#imports'

const { t } = useI18n()
const focus = (selector: string) => () => document.querySelector<HTMLElement>(selector)?.focus()

const pointer = computed<SrlNavigationItem[]>(() => [
  { label: t('toMainNavigation'), attributes: { id: 'srl-to-main-navigation' }, callback: focus('#srl-page-navigation > ul') },
  { label: t('toMainContent'), attributes: { id: 'srl-to-main-content' }, callback: focus('#srl-page-main') },
  { label: t('toFooter'), attributes: { id: 'srl-to-footer' }, callback: focus('#srl-page-footer') },
])
</script>

<template>
  <nav id="srl-page-keyboardpointer" class="srl-page__keyboardpointer" tabindex="-1">
    <SrlMenu name="keyboardpointer" :menu="pointer" />
  </nav>
</template>

<style lang="scss">
@use 'srl';

.srl-page__keyboardpointer {
  overflow: hidden;
  height: 0;

  &:has(*:focus) {
    height: auto;
    @include srl.spacer-padding-block(200);
  }

  ul {
    list-style: none;
    margin: 0 auto;
    padding: 0 var(--srl-container-padding);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: var(--srl-gutter-column-gap);
    row-gap: var(--srl-gutter-row-gap);
    max-width: var(--srl-container-max-width);
  }

  li {
    margin: 0 0 0 srl.system-size-unit(-15);
    padding: 0;
  }

  button {
    @include srl.typography-paragraph();
    padding-block: srl.system-size-unit(5);
    padding-inline: srl.system-size-unit(15);
    background-color: transparent;
    border: 0;
  }
}
</style>
