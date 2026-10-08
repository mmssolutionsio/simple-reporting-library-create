import { computed } from 'vue'
import type { SrlNavigationItem } from '#imports'

export interface GlobalLink extends SrlNavigationItem {
  href: string
}

export interface GlobalLinks {
  home?: GlobalLink
  downloads?: GlobalLink
  search?: GlobalLink
}

/** Home, download center and search of the current locale (special pages by component, SRL 1 uuids as fallback). */
export function useGlobalLinks() {
  const manifest = useSrlManifest()
  const locale = useSrlLocale()
  return computed<GlobalLinks>(() => {
    const table = manifest.table.locale[locale.value]
    if (!table) return {}
    const find = (component: string, uuid: string) =>
      table.entries.find((entry) => entry.component === component) ?? table.byUuid[uuid]
    const link = (entry?: { title: string; path: string }) => (entry ? { label: entry.title, href: entry.path } : undefined)
    return {
      home: link(table.index),
      downloads: link(find('DownloadCenter', '00-01-downloads')),
      search: link(find('Search', '00-02-search')),
    }
  })
}
