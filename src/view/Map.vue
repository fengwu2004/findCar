<template>
  <div>
    <div id="map" class="page"></div>
    <find-car-btn v-if="!navigation.start" @find-car="beginFindCar"></find-car-btn>
    <navigation v-if='navigation.start' v-on:stop="onStopNavigate"></navigation>
    <floor-list-control v-if="floorList" @on-select="doChangeFloor" :floor-list="floorList" :located-index="locateFloorIndex" :selected-index="currentFloorIndex"></floor-list-control>
  </div>
</template>

<script>

  // import '@/yfmap.min'
  import {
    idrMapView,
    idrNetworkInstance,
    idrMapEvent,
    idrLocateServerInstance,
  } from '../../../indoorunMap/map'

  import FloorListControl from '@/components/FloorListControl.vue'
  import navigation from '@/components/navigation.vue'
  import FindCarBtn from "@/components/FindCarBtn";
  import { mapGetters } from 'vuex'

  export default {
    name: "Map",
    components: {
      FloorListControl,
      navigation,
      FindCarBtn},
    data() {
      return {
        startLocate:false,
        floorList:null,
        currentFloorName:'',
        currentFloorIndex:null,
        locateFloorIndex:null,
        mapInfo:null,
        map:null,
        dolocate:false,
        regionId:'14707947068300001',
        parkingUnitId:null,
        parkingFloorIndex:null,
        enableError:false,
        needConfirm:false,
        first:true,
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

      if (this.$route.query.unit) {

        this.parkingUnitId = decodeURI(this.$route.query.unit)
      }

      if (this.$route.query.floor) {

        this.parkingFloorIndex = parseInt(decodeURI(this.$route.query.floor))
      }

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

              this.map.changeFloor(start.floorIndex)

              this.map.birdLook()

              this.map.setStatus(YFM.Map.STATUS_NAVIGATE)

              resolve()
            })
        }))
      },
      onStopNavigate() {

        this.stopRouteAndClean(true)
      },
      doChangeFloor(floorIndex) {

        this.map.autoChangeFloor = false

        this.map.changeFloor(floorIndex)
      },
      onInitMapSuccess(mapInfo) {

        document.title = mapInfo.name

        this.mapInfo = mapInfo

        this.floorList = mapInfo.floorList

        this.map.changeFloor(this.parkingFloorIndex)
      },
      onFirstShowFloor() {

        this.doLocating()

        const unit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.addUnitsOverlay([unit], './static/parkingcar.png')
      },
      onFloorChangeSuccess({floorIndex}) {

        this.currentFloorIndex = floorIndex

        if (this.first) {

          this.onFirstShowFloor()

          this.first = false
        }

        this.currentFloorName = this.getCurrentName()
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

        const unit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.doRoute({end:unit})
          .then(res=>{

            this.onRouterSuccess(res)
          })
      },
      handleConfirmNavigate() {

        this.onRouterSuccess(this.confirmObj)

        this.needConfirm = false
      },
      doBirdLookFirst(res) {

        this.confirmObj = res

        this.needConfirm = true
      },
      navigateToCar({id:unitId}, birdLookFirst = false) {

        var unit = this.map.findUnitWithId(unitId)

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
      onLocateSuccess(pos){

        this.map.setUserPos(pos)

        this.locateFloorIndex = pos.floorIndex
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

          this.stopRouteAndClean()

          var confirm = {name:'知道了', callback:() => {

              window.Alertboxview.hide()
            }}

          window.Alertboxview.show('您已到达目的地', null, [confirm])
        }
      },
      stopRouteAndClean(removeEndMarker = true) {

        this.map.stopRoute()

        this.$store.dispatch('stopNavigation')
          .then(()=>{

            if (removeEndMarker) {

              this.map.removeMarker(this.endMarker)

              this.endMarker = null
            }

            this.map.setStatus(YFM.Map.STATUS_TOUCH)
          })

      }
    }
  }
</script>
<style scoped lang="scss">



</style>
