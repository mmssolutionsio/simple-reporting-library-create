<script setup lang="ts">
/** Label with optional icon / image / svg (svg: markup, data URI, URL or component – rendered by SrlSvg). */
defineOptions({ inheritAttrs: false })
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
}>()
</script>

<template>
  <img v-if="img" :src="img.src" :alt="img.alt || label" />
  <i v-else-if="icon" :class="`srl-icon srl-icon-${icon}`" />
  <SrlSvg v-else-if="svg" :svg="svg" :aria-label="label" />
  <template v-else>
    <img v-if="imgBefore" :src="imgBefore.src" :alt="imgBefore.alt ?? ''" aria-hidden="true" />
    <i v-else-if="iconBefore" :class="`srl-icon srl-icon-${iconBefore}`" />
    <SrlSvg v-else-if="svgBefore" :svg="svgBefore" aria-hidden="true" />
    <span v-text="label" />
    <img v-if="imgAfter" :src="imgAfter.src" :alt="imgAfter.alt ?? ''" aria-hidden="true" />
    <i v-else-if="iconAfter" :class="`srl-icon srl-icon-${iconAfter}`" />
    <SrlSvg v-else-if="svgAfter" :svg="svgAfter" aria-hidden="true" />
  </template>
</template>
