const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "PWA Oventa",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/sw.js",
      swDest: "service-worker.js",
    },
  },
})
