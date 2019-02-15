/**
 * 客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：
 */
import '@babel/polyfill'
import 'es6-promise/auto'
import { createApp } from '@/main'

const {
  app,
  store,
  router
} = createApp()
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

/**
 * 需要注意的是，任然需要在挂载 app 之前调用 router.onReady，因为路由器必须要提前解析路由配置中的异步组件，
 * 才能正确地调用组件中可能存在的路由钩子。
 */
router.onReady((to) => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  const firstMatched = router.getMatchedComponents(to)
  console.log(firstMatched, 'firstMatched')
  firstMatched.map(c => {
    if (c.asyncData) {
      c.asyncData({ store, route: router.currentRoute })
    }
  })

  router.beforeResolve(async (to, from, next) => {
    // console.warn('beforeResolve')
    // console.log(to, from)
    const [matched] = router.getMatchedComponents(to) || []
    if (matched && matched.asyncData) {
      await matched.asyncData({ store, route: to })
    }
    next()
  })
  console.log('client mount')
  app.$mount('#app')
})
