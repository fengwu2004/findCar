import Vue from 'vue'
import Router from 'vue-router'
import map from '@/view/Map'

Vue.use(Router)

const base = process.env.NODE_ENV === 'production' ? '/thxz/' : '/'

export default new Router({
  mode: 'history',
  base,
  routes: [
    {
      path: '/',
      name: 'map',
      component: map
    }
  ]
})
