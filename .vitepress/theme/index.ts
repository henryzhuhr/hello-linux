// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import './style.scss'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },

  setup() {
    const route = useRoute()
    const initZoom = () => {
      // 为所有图片增加缩放功能
      // https://welives.github.io/blog/misc/vitepress/image-zoom.html
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }

} satisfies Theme
