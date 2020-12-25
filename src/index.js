/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

module.exports = function (api, ctx) {
  api.extendQuasarConf((conf, api) => {
    // make sure pwa-installer boot file is registered
    conf.boot.push({
      path: '~quasar-app-extension-pwa-installer/src/boot/main.js',
      server: false,
    })

    // make sure boot file transpiles
    conf.build.transpileDependencies.push(/quasar-app-extension-pwa-installer[\\/]src[\\/]boot/)
    // if boot file imports anything, make sure that
    // the regex above matches those files too!
  })
}
