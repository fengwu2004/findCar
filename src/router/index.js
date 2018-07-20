import Vue from 'vue'
import Router from 'vue-router'
import map from '@/view/Map'
import EmptySpace from '@/view/EmptySpace'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/emptyspace',
      name: 'emptyspace',
      component: EmptySpace
    },
    {
      path: '/',
      name: 'map',
      component: map
    }
  ]
})
