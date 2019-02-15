/**
 * 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。
 * 此时，创建和返回应用程序实例之外，还在此执行服务器端路由匹配(server-side route matching)和
 * 数据预取逻辑(data pre-fetching logic)。
 */
// import '@babel/polyfill'
import { createApp } from '@/main'
export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    // 获取打包好的对象
    const {
      app,
      store,
      router
    } = createApp(context)
    const meta = app.$meta()
    // 设置服务器端 router 的位置到前端对象中
    router.push(context.url)
    context.meta = meta
    console.log(router.currentRoute, 'router.currentRoute')
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component'))
      }

      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
