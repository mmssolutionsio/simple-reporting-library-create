import { computed } from 'vue'

const DESKTOP = ['tablet-ls', 'desktop', 'desktop-large']

/** SRL 1 `isDesktopView` (was a module-level computed; now per app, false on the server). */
export function useIsDesktopView() {
  const viewport = useSrlViewport()
  return computed(() => DESKTOP.includes(viewport.value.viewPort ?? ''))
}
