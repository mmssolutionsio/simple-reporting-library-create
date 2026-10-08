<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
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
  type: 'button' | 'link' | 'submit'
  callback: () => void
}>()

const classes = computed(() => ({
  'srl-button': true,
  'srl-button--icon': !!(props.icon || props.img || props.svg),
  'srl-has-icon': !!(props.iconBefore || props.iconAfter || props.imgBefore || props.imgAfter || props.svgBefore || props.svgAfter),
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const el = ref<any>()
defineExpose({ $el: computed(() => el.value?.$el ?? el.value) })
</script>

<template>
  <button ref="el" :type="type === 'submit' ? 'submit' : 'button'" :title="title" :aria-label="icon ? label : undefined" :class="classes" @click="callback()">
    <ButtonDefaultContent v-bind="props" />
  </button>
</template>
