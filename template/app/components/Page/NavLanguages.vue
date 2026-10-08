<script lang="ts" setup>
import { computed } from 'vue'
import type { SrlNavigationItem } from '#imports'

const languages = useSrlLanguageSwitch()
const items = computed<SrlNavigationItem[]>(() =>
  languages.value.all.map((item) => ({ label: item.label.toUpperCase(), href: item.href, active: item.active })),
)
</script>

<template>
  <nav class="srl-language-switch srl-py-medium">
    <SrlMenu class="srl-gap-medium" name="language-switch" :menu="items" />
  </nav>
</template>

<style lang="scss">
@use 'srl';

.srl-language-switch {
  ul {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
  }
  a {
    color: srl.colors-white-1000();
    text-decoration: none;
    text-transform: uppercase;
  }
}
</style>
