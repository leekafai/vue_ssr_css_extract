/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Indexp from '@/views/Home'
import About from '@/views/About'
console.log(Indexp, 'xxxx')
// import News from '@/views/News'
// import NewsList from '@/views/NewsList'
Vue.use(Router)
// 部分插件用到document的，暂时不要使用路由懒加载
export const createRouter = () => {
  return new Router({
    mode: 'history',
    base: '/news',
    routes: [
      {
        path: '/',
        name: 'Index',
        // component: () => import(/* webpackChunkName: "Index" */'@/views/Index')
        component: Indexp
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: About
      }
      // {
      //   path: '/news',
      //   name: 'News',
      //   // component: () => import(/* webpackChunkName: "News" */'@/views/News')
      //   component: News
      // },
      // {
      //   path: '/newslist',
      //   name: 'NewsList',
      //   // component: () => import(/* webpackChunkName: "NewsList" */'@/views/NewsList')
      //   component: NewsList
      // }
    ]
  })
}
