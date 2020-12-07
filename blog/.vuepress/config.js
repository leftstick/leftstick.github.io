module.exports = {
  title: '右领军大都督',
  theme: '@vuepress/theme-blog',
  themeConfig: {
    // Please keep looking down to see the available options.
  },
  plugins: {
    '@vuepress/medium-zoom': {
      selector: '.content__default > p > img',
      options: {
        margin: 5
      }
    }
  },
}