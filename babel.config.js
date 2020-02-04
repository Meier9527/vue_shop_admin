// 这是项目发布阶段用到的babel插件
const pordPlugins = []
if (process.env.NOOD_ENV === 'production') {
  pordPlugins.push('transform-remove-console')
}
module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    ...pordPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
