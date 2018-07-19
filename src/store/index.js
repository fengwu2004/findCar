import Vue from 'vue'
import Vuex from 'vuex'
import { map } from './modules/map'
import { navigation } from './modules/navigation'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    map,
    navigation
  },
  getters
})

export default store
