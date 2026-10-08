<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const prevNext = useSrlPrevNext()
const scrollY = ref(0)
const onScroll = () => (scrollY.value = window.scrollY)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const check = () => {
    if (window.scrollY === 0) document.querySelector<HTMLElement>('#srl-page-main')?.focus()
    else requestAnimationFrame(check)
  }
  requestAnimationFrame(check)
}
</script>

<template>
  <div>
    <slot />
    <div class="srl-grid srl-wide-width srl-to-top">
      <div class="srl-grid__inner srl-to-top__inner">
        <ButtonDefault class="srl-to-top__button" :hidden="scrollY < 500" :label="$t('toTop')" icon="arrow-up" :callback="toTop" />
      </div>
    </div>
    <div class="srl-grid srl-wide-width srl-prev-next">
      <div class="srl-grid__inner srl-prev-next__inner">
        <div class="srl-prev-next__prev">
          <NuxtLink v-if="prevNext.prev" class="srl-page-prev__link" :to="prevNext.prev.path" :title="prevNext.prev.title">
            <div class="srl-page-prev__icon srl-page-prev__icon--prev srl-button srl-button--icon">
              <i class="srl-icon-arrow-left" />
            </div>
            <div class="srl-page-prev__text">
              <span class="srl-page-prev__title" v-text="prevNext.prev.title" />
            </div>
          </NuxtLink>
        </div>
        <div class="srl-prev-next__next">
          <NuxtLink v-if="prevNext.next" class="srl-page-prev__link" :to="prevNext.next.path" :title="prevNext.next.title">
            <div class="srl-page-prev__text">
              <span class="srl-page-prev__title" v-text="prevNext.next.title" />
            </div>
            <div class="srl-page-prev__icon srl-page-prev__icon--prev srl-button srl-button--icon">
              <i class="srl-icon-arrow-right" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use 'srl';

.srl-prev-next {
  @include srl.spacer-margin-top(400);
}

.srl-prev-next__inner {
  display: grid;
  grid-template-columns: subgrid;
}

.srl-to-top {
  position: sticky;
  bottom: var(--srl-spacer-400);
  margin-top: var(--srl-spacer-1600);
  margin-bottom: var(--srl-spacer-400);
  display: flex;
  justify-content: flex-end;
  z-index: 3;
  pointer-events: none;
  @include srl.grid-col(4);
  @include srl.grid-col(4, phone-ls);
  @include srl.grid-col(8, tablet-pt);
  @include srl.grid-col(8, tablet-ls);
  @include srl.grid-col(12, desktop);
  @include srl.grid-col(12, desktop-large);
}

.srl-to-top__button {
  pointer-events: all;
  &:not([hidden]) {
    display: flex;
  }

  &[hidden] {
    pointer-events: none;
    opacity: 0;
  }
}

.srl-prev-next__prev,
.srl-prev-next__next {
  @include srl.grid-col(4);
}

.srl-prev-next__next {
  @include srl.grid-offset(8, tablet-ls);
  @include srl.grid-offset(8, desktop);
  @include srl.grid-offset(8, desktop-large);
}

.srl-page-prev__link {
  @extend %srl-button__switch;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include srl.spacer-gap(200);
  @include srl.typography-paragraph();
  text-decoration: none;
  color: srl.colors-black-1000();
  transition: color 0.3s ease;
  @include srl.spacer-padding-top(400);
  @include srl.spacer-padding-bottom(400);
  border-top: 1px solid srl.colors-grey-200();

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0s;
  }
}

.srl-page-prev__text {
  width: calc(100% - srl.system-size-unit(48) - srl.spacer-get(200));
}
</style>
