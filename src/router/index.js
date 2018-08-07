import Vue from 'vue'
import Router from 'vue-router'
import map from '@/view/Map'
import EmptySpace from '@/view/EmptySpace'
import ParkingList from '@/view/ParkingList'
import EmptyList from '@/view/EmptyList'

Vue.use(Router)

const base = process.env.NODE_ENV === 'production' ? '/thxz/' : '/'

export default new Router({
  mode: 'history',
  base,
  routes: [
    {
      path: '/emptyspace',
      name: 'emptyspace',
      component: EmptySpace
    },
    {
      path: '/map',
      name: 'map',
      component: map
    },
    {
      path: '/',
      name: 'emptylist',
      component: EmptyList
    }
  ]
})
