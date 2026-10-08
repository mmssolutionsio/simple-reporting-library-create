<script setup lang="ts">
/** SRL 1 project button (livingdocs components import '@/components/Button/Default.vue'). */
import { computed, ref } from 'vue'
import { isRouterPath } from '#utils'

const props = withDefaults(
  defineProps<{
  label: string
  title?: string
  img?: { src: string; alt?: string }
  imgBefore?: { src: string; alt?: string }
  imgAfter?: { src: string; alt?: string }
  icon?: string
  iconBefore?: string
  iconAfter?: string
  svg?: string | object
  svgBefore?: string | object
  svgAfter?: string | object
    href?: string
    type?: 'button' | 'link' | 'submit'
    callback?: () => void
  }>(),
  { type: 'button', callback: () => {} },
)

const title = computed(() => props.title || props.label || undefined)
const content = computed(() => ({
  label: props.label,
  img: props.img,
  imgBefore: props.imgBefore,
  imgAfter: props.imgAfter,
  icon: props.icon,
  iconBefore: props.iconBefore,
  iconAfter: props.iconAfter,
  svg: props.svg,
  svgBefore: props.svgBefore,
  svgAfter: props.svgAfter,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const child = ref<any>()
defineExpose({ $el: computed(() => child.value?.$el) })
</script>

<template>
  <ButtonDefaultInternalLink v-if="href && isRouterPath(href)" ref="child" :title="title" :href="href" v-bind="content" />
  <ButtonDefaultExternalLink v-else-if="href" ref="child" :title="title" :href="href" v-bind="content" />
  <ButtonDefaultAction v-else ref="child" :title="title" :type="type" :callback="callback" v-bind="content" />
</template>
