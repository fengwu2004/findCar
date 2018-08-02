// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import AlertBox from './AlertBox.js'
import ErrorTipView from './ErrorTipView.js'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Vue.use(Vuex)

window.debugtest = false

window.Alertboxview = new AlertBox()

window.Toast = new ErrorTipView()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

