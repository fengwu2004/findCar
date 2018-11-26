<template>
  <div>
    <div id="map" class="page"></div>
    <find-car-btn v-if="!mapState.markInMap && !navigation.start && !needConfirm" @find-car="beginFindCar"></find-car-btn>
    <navigation v-if='navigation.start' v-on:stop="onStopNavigate"></navigation>
    <confirm-navigate-bar @confirmNavigate="handleConfirmNavigate" v-if="needConfirm"></confirm-navigate-bar>
    <floor-list-control v-if="floorList" @on-select="doChangeFloor" :floor-list="floorList" :located-index="locateFloorIndex" :selected-index="currentFloorIndex"></floor-list-control>
  </div>
</template>

<script>

  // import '@/yfmap.min'
  import {
    idrMapView,
    idrNetworkInstance,
    idrMapEvent,
    idrMarker,
    idrLocateServerInstance,
    idrWxManagerIntance
  } from '../../../indoorunMap/map'

  import FloorListControl from '@/components/FloorListControl.vue'
  import navigation from '@/components/navigation.vue'
  import FindCarBtn from "@/components/findCarBtn";
  import { mapGetters } from 'vuex'
  import { Indicator } from 'mint-ui';
  import ConfirmNavigateBar from "@/components/ConfirmNavigateBar";

  export default {
    name: "Map",
    components: {
      ConfirmNavigateBar,
      FloorListControl,
      navigation,
      FindCarBtn},
    data() {
      return {
        showFacilityPanel:false,
        startLocate:false,
        floorList:null,
        currentFloorName:'',
        currentFloorIndex:null,
        locateFloorIndex:null,
        regionEx:null,
        map:null,
        dolocate:false,
        regionId:'14707947068300001',
        carno:null,
        endMarker:null,
        audioTime:0,
        audio:null,
        errorCount:0,
        willnavigatecar:false,
        enableError:false,
        needConfirm:false,
        confirmObj:{start:null, end:null}
      }
    },
    computed: {
      ...mapGetters([
        'mapState',
        'navigation'
      ])
    },
    mounted() {

      this.carno = decodeURI(this.$route.query.carNo)

      this.regionId = "14707947068300001"

      this.initMap()
    },
    methods:{
      initMap() {

        this.map = new idrMapView()

        this.map.initMap('yf1248331604', 'map', this.regionId)

        this.map.addEventListener(idrMapEvent.types.onFloorChangeSuccess, data => {

          this.onFloorChangeSuccess(data)
        })

        this.map.addEventListener(idrMapEvent.types.onInitMapSuccess, mapInfo => {

          this.onInitMapSuccess(mapInfo)
        })

        this.map.addEventListener(idrMapEvent.types.onNaviStatusUpdate, (data) => {

          this.onNaviStatusUpdate(data)
        })
      },
      onRouterSuccess({start, end}, findcar = true) {

        return new Promise((resolve => {

          this.$store.dispatch('startNavigation', findcar)
            .then(()=>{

              this.addEndMarker(end)

              this.map.changeFloor(start.floorIndex)

              this.map.birdLook()

              this.map.setStatus(YFM.Map.STATUS_NAVIGATE)

              resolve()
            })
        }))
      },
      onStopNavigate() {

        if (!this.navigation.findCar) {

          this.stopRouteAndClean(true)

          return
        }

        var unfind = {name:'未找到爱车', callback:()=> {

            Alertboxview.hide()

            this.stopRouteAndClean(false)
          }}

        var found = {name:'已找到爱车', callback:()=> {

            Alertboxview.hide()

            this.stopRouteAndClean(true)

            this.playAudio('已找到爱车')

            this.onNaviToOuter()
          }}

        var cancel = {name:'取消', callback:() => {

            Alertboxview.hide()
          }}

        Alertboxview.show('在中断导航前', '是否已找到您的爱车', [unfind, found, cancel])
      },
      doChangeFloor(floorIndex) {

        this.map.autoChangeFloor = false

        this.map.changeFloor(floorIndex)
      },
      onInitMapSuccess(regionEx) {

        document.title = regionEx.name

        this.regionEx = regionEx

        this.floorList = regionEx.floorList

        this.map.changeFloor(regionEx.floorList[0].floorIndex)
      },
      onFloorChangeSuccess({floorIndex}) {

        this.currentFloorIndex = floorIndex

        if (!this.startLocate) {

          this.doLocating()

          this.startLocate = true
        }

        this.currentFloorName = this.getCurrentName()

        this.map.set2DMap(true)
      },
      getCurrentName() {

        for (var i = 0; i < this.floorList.length; ++i) {

          if (this.floorList[i].floorIndex === this.currentFloorIndex) {

            return this.floorList[i].name
          }
        }

        return null
      },
      beginFindCar(){

        if (this.endMarker) {

          if (!idrWxManagerIntance._beaconStart) {

            window.HeaderTip.show('蓝牙未开启，请开启蓝牙')

            return
          }

          this.map.doRoute({start:null, end:this.endMarker})
            .then(res=>{

              return this.onRouterSuccess(res)
            })
            .catch(res=>{

              window.HeaderTip.show(res)
            })

          return
        }

        this.$store.dispatch('startSearchCarByPlateNumber').catch(e=>console.log(e))

        this.preparePlayAudio()
      },
      handleConfirmNavigate() {

        this.onRouterSuccess(this.confirmObj)

        this.needConfirm = false
      },
      navigateToCar({id:unitId}, birdLookFirst = false) {

        var unit = this.map.findUnitWithId(unitId)

        this.addEndMarker(unit.position)

        this.map.centerPos(unit.position)

        this.map.doRoute({start:null, end:unit})
          .then(res=>{

            if (birdLookFirst) {

              this.doBirdLookFirst(res)
            }
            else {

              return this.onRouterSuccess(res)
            }
          })
          .catch(res=>{

            window.HeaderTip.show(res)
          })
      },
      doLocating() {

        if (this.map.getUserPos()) {

          this.dolocate = true

          this.map.centerPos(this.map.getUserPos(), false)

          this.map.autoChangeFloor = true
        }
        else {

          this.map.doLocation(pos => this.onLocateSuccess(pos), ({msg}) => {

            this.onLocateFailed(msg)
          })
            .catch(msg=>{

              if (msg == 'Bluetooth_poweroff') {

                HeaderTip.show('蓝牙未开启，请打开蓝牙')
              }
            })
        }
      },
      dofindCarWhenLocateSuccess() {

        Indicator.open()

        idrNetworkInstance.getParkingPlaceUnitByCarNo(this.carno.toUpperCase(), this.regionId)
          .then(({data})=>{

            Indicator.close()

            if (!data) {

              return Promise.reject(null)
            }

            this.navigateToCar(data, true)
          })
          .catch(e=>{

            Indicator.close()

            console.log(e)
          })
          .finally(()=>{

            Indicator.close()
          })
      },
      onLocateSuccess(pos){

        this.map.setUserPos(pos)

        this.locateFloorIndex = pos.floorIndex

        if (this.willnavigatecar) {

          this.dofindCarWhenLocateSuccess()

          this.willnavigatecar = false
        }
      },
      onLocateFailed(){

        if (this.enableError) {

          HeaderTip.show("当前位置蓝牙信号较少，请耐心等待")

          this.enableError = false
        }
      },
      onSelect(val) {

        this.locateFloorIndex = val

        this.map.changeFloor(val)

        this.map.autoChangeFloor = false
      },
      onMapClick(pos) {

        if (window.debugtest) {

          idrLocateServerInstance.debugPos = pos
        }
      },
      onNaviStatusUpdate({validate, projDist, goalDist, serialDist, nextSug}) {

        if (!validate || this.needConfirm) {

          return
        }

        if (projDist >= 120) {

          this.map.reRoute()

          return
        }

        const totalDistance = Math.ceil(goalDist/10.0)

        const nextDistance = Math.ceil(serialDist/10.0)

        let nextdir = -1

        if (nextSug == YFM.Map.Navigate.NextSuggestion.LEFT) {

          nextdir = 0
        }

        if (nextSug == YFM.Map.Navigate.NextSuggestion.RIGHT) {

          nextdir = 1
        }

        if (nextSug == YFM.Map.Navigate.NextSuggestion.FRONT) {

          nextdir = 2
        }

        this.$store.dispatch('setNaviStatus', {nextdir, totalDistance, nextDistance})

        if (totalDistance < 15) {

          this.playAudio('您已到达目的地')

          this.stopRouteAndClean()

          var confirm = {name:'知道了', callback:() => {

              window.Alertboxview.hide()
            }}

          window.Alertboxview.show('您已到达目的地', null, [confirm])
        }
      },
      stopRouteAndClean(removeEndMarker = true) {

        this.map.stopRoute()
          .then(()=>{

            return this.$store.dispatch('stopNavigation')
          })
          .then(()=>{

            if (removeEndMarker) {

              this.map.removeMarker(this.endMarker)

              this.endMarker = null
            }

            this.map.setStatus(YFM.Map.STATUS_TOUCH)
          })
      },
      addEndMarker(pos) {

        this.map.removeMarker(this.endMarker)

        var endMarker = new idrMarker({pos, image:'./static/markericon/end.png'})

        this.endMarker = this.map.addMarker(endMarker)
      }
    }
  }
</script>
<style scoped lang="scss">



</style>
