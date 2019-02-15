/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import Meta from 'vue-meta'
Vue.use(Meta)
Vue.config.productionTip = false

export const createApp = ssrContext => {
  const router = createRouter()
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  const app = new Vue({
    router,
    store,
    ssrContext,
    render: h => h(App)
  })

  return {
    app,
    store,
    router
  }
}
