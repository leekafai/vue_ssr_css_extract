/**
 * 获取的数据需要位于视图组件之外，即放置在专门的数据预取存储容器(data store)或"状态容器(state container)）"中。
 * 首先，在服务器端，我们可以在渲染之前预取数据，并将数据填充到 store 中。此外，我们将在 HTML 中序列化(serialize)
 * 和内联预置(inline)状态
 */

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
const beHost = 'http://47.106.251.178:8083'
export const createStore = () => {
  return new Vuex.Store({
    state: {
      newsView: {},
      indexView: {},
      newslistView: {},
      indexNewsListPids: [111, 112]
    },
    actions: {
      async getNews ({ commit }, id) {
        const resp = await axios.get(
          beHost + '/open/getNews/?id=' + id
        )
        const rdata = resp.data
        commit('setNews', rdata.data)
      },
      async getNewsListView ({ commit }, { pid, limit, page }) {
        const resp = await axios.get(
          beHost + '/open/getNewsList', { params: { pid, limit, page } }
        )
        const rdata = resp.data
        commit('setNewsListViewNewsList', { pid, listData: rdata.data })
        const siteresp = await axios.get(beHost + '/open/getSiteInfo', { params: { id: pid } })
        const rsiteData = siteresp.data
        commit('setNewsListViewSiteInfo', { pid, siteInfo: rsiteData.data })
      },
      async getIndex ({ state, commit }) {
        // 并行获取各个栏目的前几篇标题
        const respNewsLists = await Promise.all(state.indexNewsListPids.map((pid) => {
          return axios.get(
            beHost + '/open/getNewsList', { params: { pid } }
          )
        }))
        // console.log(respNewsLists, 'respNewsLists')
        // 数据填充
        respNewsLists.forEach((resp) => {
          const rdata = resp.data
          const pid = resp.config.params.pid
          const { newsList, count } = rdata.data
          commit('setIndex', { pid, listData: { list: newsList, count } })
        })
      }
    },
    mutations: {
      setIndex (state, { pid, listData }) {
        Vue.set(state.indexView, pid, listData)
      },
      setNewsListViewSiteInfo (state, { pid, siteInfo }) {
        Vue.set(state.newslistView, 'siteInfo', siteInfo)
      },
      setNewsListViewNewsList (state, { pid, listData }) {
        Vue.set(state.newslistView, 'newsList', listData.newsList)
        Vue.set(state.newslistView, 'count', listData.count)
      },
      setNews (state, data) {
        Vue.set(state, 'newsView', data)
      }
    }
  })
}
