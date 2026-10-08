<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SrlNavigationItem } from '#imports'

const emit = defineEmits<{ (e: 'toggle', data: unknown): void; (e: 'routerChange' | 'focusMain'): void }>()

const manifest = useSrlManifest()
const globalLinks = useGlobalLinks()
const languages = useSrlLanguageSwitch()
const isDesktopView = useIsDesktopView()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menu = ref<any>()

const metaNav = computed<SrlNavigationItem[]>(() => {
  const nav: SrlNavigationItem[] = []
  if (manifest.table.locales.length > 1) {
    nav.push({
      label: languages.value.current.label.toUpperCase(),
      iconAfter: 'chevron-down',
      children: languages.value.items.map((item) => ({ label: item.label.toUpperCase(), href: item.href })),
      attributes: { class: 'srl-button' },
    })
  }
  const { downloads, search } = globalLinks.value
  if (downloads) nav.push({ label: downloads.label, href: downloads.href, icon: 'download', attributes: { class: 'srl-button srl-button--icon' } })
  if (search) nav.push({ label: search.label, href: search.href, icon: 'search', attributes: { class: 'srl-button srl-button--icon' } })
  return nav
})

function tab(event: KeyboardEvent) {
  if (isDesktopView.value) {
    emit('focusMain')
  } else {
    event.preventDefault()
    document.querySelector<HTMLElement>('#srl-page-navigation > ul')?.focus()
  }
}

defineExpose({ menu })
</script>

<template>
  <nav id="srl-meta-navigation" class="srl-meta-navigation" tabindex="-1">
    <SrlMenu
      ref="menu"
      name="meta-navigation"
      :menu="metaNav"
      class="srl-meta-navigation__menu"
      @toggle="(data: unknown) => emit('toggle', data)"
      @router-change="emit('routerChange')"
      @close="emit('focusMain')"
      @keydown.tab="tab"
    />
  </nav>
</template>
