import Vue from 'vue'
import Router from 'vue-router'
import map from '@/view/Map'
import EmptySpace from '@/view/EmptySpace'
import ParkingList from '@/view/ParkingList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base:'/thxz/',
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
      name: 'parkinglist',
      component: ParkingList
    }
  ]
})
