import Vue from 'vue'
import Router from 'vue-router'
import map from '@/view/Map'
import EmptySpace from '@/view/EmptySpace'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'emptyspace',
      component: EmptySpace
    }
  ]
})
