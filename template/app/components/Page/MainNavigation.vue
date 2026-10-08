<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { SrlNavigationItem } from '#imports'
import SvgNavArrowRight from '~/assets/images/nav-arrow-right.svg?raw'
import SvgNavArrowLeft from '~/assets/images/nav-arrow-left.svg?raw'

const props = defineProps<{ mainNavigation: SrlNavigationItem[] }>()
const emit = defineEmits<{ (e: 'toggle', data: unknown): void; (e: 'routerChange' | 'focusMain'): void }>()

const isDesktopView = useIsDesktopView()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menu = ref<any>()

function withArrows(item: SrlNavigationItem): SrlNavigationItem {
  if (!item.children?.length) return item
  return { ...item, svgAfter: SvgNavArrowRight, children: item.children.map(withArrows) }
}

const navigation = computed<SrlNavigationItem[]>(() =>
  props.mainNavigation.map((item) =>
    isDesktopView.value ? { ...item, children: item.children?.map(withArrows) } : withArrows(item),
  ),
)

function tab(event: KeyboardEvent) {
  if (isDesktopView.value) {
    emit('focusMain')
  } else {
    event.preventDefault()
    menu.value?.closeAll()
    document.querySelector<HTMLElement>('#srl-meta-navigation > ul')?.focus()
  }
}

defineExpose({ menu })
</script>

<template>
  <nav id="srl-page-navigation" class="srl-main-navigation" tabindex="-1">
    <SrlMenu
      ref="menu"
      name="main-navigation"
      :menu="navigation"
      class="srl-main-navigation-menu"
      :back-path="[{ label: 'Main Menu' }]"
      :back-button-label="(backPath: SrlNavigationItem[]) => $t('page.navigation.back', { label: backPath[0]?.label })"
      :back-button-enabled="!isDesktopView"
      :back-button-item="{ svgBefore: SvgNavArrowLeft }"
      @router-change="emit('routerChange')"
      @close="emit('focusMain')"
      @keydown.tab.stop="tab"
      @toggle="(data: unknown) => emit('toggle', data)"
    />
  </nav>
</template>
