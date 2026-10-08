<script lang="ts" setup>
// SRL 1 dev/src/components/PageFooter.vue.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SrlNavigationItem } from '#imports'
import SvgLogo from '~/assets/images/logo.svg?raw'

const { t, te, tm, rt } = useI18n()

interface Contact {
  label: string
  key: string
  title?: string
  href?: string
  linkText?: string
  attributes?: Record<string, string>
}

const contact = computed<Contact[]>(() => {
  const c: Contact[] = []
  if (te('address.company')) c.push({ label: t('address.company'), key: 'company', attributes: { class: 'srl-bold' } })
  for (const key of ['location', 'location2', 'city', 'country']) {
    if (te(`address.${key}`)) c.push({ label: t(`address.${key}`), key })
  }
  const link = (key: string, scheme: string, labelKey: string, titleKey: string) => {
    if (!te(`address.${key}`)) return
    const value = t(`address.${key}`)
    c.push({
      label: te(labelKey) ? t(labelKey) : '',
      key,
      title: te(titleKey) ? t(titleKey) : value,
      linkText: value,
      href: `${scheme}:${value}`,
    })
  }
  link('phone', 'tel', 'footer.phone', 'accessibility.callNumber')
  link('fax', 'fax', 'footer.fax', 'accessibility.callFax')
  link('email', 'mailto', 'footer.email', 'accessibility.sendEmail')
  return c
})

const SOCIAL: Record<string, { label: string; icon: string }> = {
  linkedIn: { label: 'LinkedIn', icon: 'linkedin-in' },
  xing: { label: 'Xing', icon: 'xing' },
  twitter: { label: 'Twitter', icon: 'x-twitter' },
  facebook: { label: 'Facebook', icon: 'facebook-f' },
  instagram: { label: 'Instagram', icon: 'instagram' },
}

const socialLinks = computed<SrlNavigationItem[]>(() => {
  // te() is false for objects, so read the subtree directly
  const socialMedia = tm('socialMedia') as Record<string, unknown> | string
  if (!socialMedia || typeof socialMedia !== 'object') return []
  return Object.entries(socialMedia).flatMap(([key, value]) => {
    const network = SOCIAL[key]
    if (!network) return []
    const href = typeof value === 'string' ? value : rt(value as Parameters<typeof rt>[0])
    return [
      {
        label: network.label,
        href,
        icon: network.icon,
        attributes: {
          'aria-label': network.label,
          title: network.label,
          class: 'srl-button srl-button--icon srl-button--transparent-white',
        },
      },
    ]
  })
})

const furtherLinks = useSrlMenu('footerFurtherLinks')
const downloads = useSrlMenu('footerDownloads')
const downloadMenu = computed(() =>
  downloads.value.map((item) => (item.href?.endsWith('.pdf') ? { ...item, attributes: { download: '' } } : item)),
)

const meta = useSrlMenu('footerMeta')
const navigationMeta = computed<SrlNavigationItem[]>(() => [
  ...meta.value,
  { label: t('footer.privacySettings'), callback: () => alert('Privacy settings callback') },
])

const year = new Date().getFullYear()
</script>

<template>
  <footer id="srl-page-footer" class="srl-footer" tabindex="-1">
    <div class="srl-footer__inner">
      <div class="srl-footer__head">
        <p class="srl-footer__logo"><SrlSvg :svg="SvgLogo" /></p>
        <div v-if="socialLinks.length && $te('footer.followUs')" class="srl-footer__social">
          <h2 class="srl-footer__social-header" v-text="$t('footer.followUs')" />
          <nav class="srl-footer__social-nav" :aria-label="$t('footer.followUs')">
            <SrlMenu name="socialLinks" :menu="socialLinks" />
          </nav>
        </div>
      </div>
      <div class="srl-footer__content">
        <section v-if="contact.length">
          <h2 id="footer-contact" v-text="$t('footer.contact')" />
          <address class="srl-footer__address">
            <template v-for="(cont, index) in contact" :key="cont.key">
              <span :class="`srl-footer__${cont.key}`" v-bind="cont.attributes ?? {}">
                <template v-if="cont.href">{{ cont.label }}<a :href="cont.href" :title="cont.title">{{ cont.linkText }}</a></template>
                <template v-else>{{ cont.label }}</template>
              </span>
              <br v-if="index < contact.length - 1" />
            </template>
          </address>
        </section>
        <section v-if="downloads.length">
          <h2 id="footer-downloads" v-text="$t('footer.downloads')" />
          <nav aria-labelledby="footer-downloads">
            <SrlMenu name="downloads" :menu="downloadMenu" class="srl-footer__link-list" />
          </nav>
        </section>
        <section v-if="furtherLinks.length">
          <h2 id="footer-further-links" v-text="$t('footer.furtherLinks')" />
          <nav aria-labelledby="footer-further-links">
            <SrlMenu name="furtherLinks" :menu="furtherLinks" class="srl-footer__link-list" />
          </nav>
        </section>
      </div>
      <div class="srl-footer__meta">
        <nav v-if="navigationMeta.length" aria-label="Meta">
          <SrlMenu name="meta" :menu="navigationMeta" />
        </nav>
        <p v-if="$te('footer.copyright')" v-text="$t('footer.copyright', { year })" />
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use 'srl';

footer {
  background-color: srl.colors-grey-800();

  color: srl.colors-white-1000();

  :deep(a:not(.srl-button)),
  :deep(button:not(.srl-button)) {
    @include srl.typography-paragraph();
    margin: unset;
    padding: unset;
    background-color: transparent;
    border: none;
    text-decoration: none;
    cursor: pointer;
    color: srl.colors-white-1000();
  }

  section {
    display: flex;
    flex-direction: column;
    @include srl.spacer-row-gap(400);
    width: 100%;
  }

  :deep(.srl-footer__link-list) {
    display: flex;
    flex-direction: column;
    row-gap: srl.system-size-unit(10);
  }

  h2 {
    @include srl.typography-title-h3();
  }
}

.srl-footer {
  &__inner {
    @include srl.typography-paragraph();
    margin: 0 auto;
    max-width: var(--srl-container-max-width);
    padding-inline: var(--srl-container-padding);
    @include srl.spacer-padding-top(800);
    @include srl.spacer-padding-bottom(800);
    display: flex;
    flex-direction: column;
    @include srl.spacer-row-gap(800);
  }

  &__head {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    width: srl.system-size-unit(175);
  }

  &__social {
    display: flex;
    @include srl.spacer-gap(100);
    justify-content: center;
    align-items: center;

    &-header {
      @include srl.typography-paragraph();
    }

    &-nav {
      .srl-menu {
        display: flex;
        align-items: center;
        @include srl.spacer-gap(100);
      }
    }
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
    @include srl.spacer-column-gap(400);
    @include srl.spacer-row-gap(400);
    width: 100%;
  }

  &__address {
    font-style: normal;
  }

  &__meta {
    display: flex;
    @include srl.spacer-row-gap(400);
    flex-direction: column;

    :deep(a:not(.srl-button)),
    :deep(button:not(.srl-button)) {
      text-decoration: underline;
    }

    :deep(ul) {
      display: flex;
      align-items: baseline;
      gap: srl.spacer-get(400);

      @include srl.grid-media-up(tablet-pt) {
        @include srl.spacer-column-gap(400);
        flex-direction: row;
      }
    }

    :deep(a:not(.srl-button)),
    :deep(button:not(.srl-button)),
    :deep(p) {
      @include srl.typography-link();
    }
  }
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

@include srl.grid-media(print) {
  footer {
    display: none;
  }
}

@include srl.grid-media-up(tablet-pt) {
  footer {
    section {
      width: srl.system-size-unit(300);
    }
  }

  .srl-footer {
    &__head {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
  }
}

@include srl.grid-media-up(tablet-ls) {
  .srl-footer {
    &__meta {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
    }
  }
}
</style>
