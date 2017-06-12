import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import '@/common/scss/index.scss'

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  loading: require('@/common/image/default.png')
})

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
