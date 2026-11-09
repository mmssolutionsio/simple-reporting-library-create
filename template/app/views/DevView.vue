<script setup lang="ts">
// Dev only: http://localhost:3000/<locale>/dev (not part of any build). Try out components here.
// Livingdocs Vue components are global: livingdocs/**/<name>.vue → <SrlLd<Name> />.
// Restart `srl dev` after creating or deleting this file.
useHead({ htmlAttrs: { lang: useSrlLocale() }, title: 'Dev', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <article class="srl-article srl-article-root">
    <h1>Test your components here</h1>
  </article>
</template>
