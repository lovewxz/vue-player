import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

import '@/common/scss/index.scss'

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  loading: require('@/common/image/default.png')
})

fastclick.attach(document.body)
/* eslint-disable no-unused-vars */
import vConsole from 'vconsole'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
