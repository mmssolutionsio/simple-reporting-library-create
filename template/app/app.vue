<script setup lang="ts">
// Project skeleton (SRL 1 dev/src/App.vue).
const mainNavigation = useSrlMainMenu()
</script>

<template>
  <div class="srl-page__wrap">
    <PageBypassLinks />
    <PageHeader :main-navigation="mainNavigation" />
    <PageMain :main-navigation="mainNavigation" />
    <PageFooter />
  </div>
</template>

<style lang="scss">
@use 'srl';
.srl-page__wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  #srl-page-main {
    flex: 1 1 auto;
  }
}
</style>
