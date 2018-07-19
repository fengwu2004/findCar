// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import AlertBox from './AlertBox'
import ErrorTipView from './ErrorTipView'

Vue.config.productionTip = false

Vue.use(Vuex)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

window.alertboxview = new AlertBox()

window.showAlertBox = function(title, message, buttons) {
  
  window.alertboxview.show(title, message, buttons)
}

window.Toast = new ErrorTipView()
