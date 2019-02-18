<template>
  <div>
    <div id="map" class="page"></div>
    <!--<assist-bar @showCarPos="onShowCarPos"></assist-bar>-->
    <find-car-btn v-if="!navigation.start" @find-car="checkBlutToothState"></find-car-btn>
    <navigation v-if='navigation.start' v-on:stop="onStopNavigate" @birdlook="birdLook" :followStatus="followStatus" @changeToNavigate="setMapInNavigate"></navigation>
    <floor-list-control v-if="floorList" @show-all-floor="onShowAllFloor" @on-select="doChangeFloor" :showallfloor="currentFloorIndex == -1" :floor-list="floorList" :located-index="locateFloorIndex" :selected-index="currentFloorIndex"></floor-list-control>
    <not-in-parking-lot v-if="inparkingLotAlert" @do-confirm="inparkingLotAlert = false"></not-in-parking-lot>
    <blue-tooth-off v-if="blueToothAlert && !navigation.start" @do-cancel="closeBlueToothAlert" @do-confirm="goToSettingBlutTooth"></blue-tooth-off>
    <blue-tooth-off-in-navi v-if="blueToothAlert && navigation.start" @do-confirm="stopRouteAndClean"></blue-tooth-off-in-navi>
  </div>
</template>

<script>

  // import '@/yfmap.min'
  import {
    idrMapView,
    idrCoreMgr,
    idrMapEvent,
    idrLocateServerInstance, idrDebug,
  } from '../../../indoorunMap/map'

  import FloorListControl from '@/components/FloorListControl.vue'
  import navigation from '@/components/navigation.vue'
  import FindCarBtn from "@/components/findCarBar";
  import { mapGetters } from 'vuex'
  import AssistBar from "@/components/AssistBar";
  import NotInParkingLot from "@/components/NotInParkingLot";
  import BlueToothOff from "@/components/BlueToothOff";
  import BlueToothOffInNavi from "@/components/BlueToothOffInNavi";

  export default {
    name: "Map",
    components: {
      BlueToothOffInNavi,
      BlueToothOff,
      NotInParkingLot,
      AssistBar,
      FloorListControl,
      navigation,
      FindCarBtn},
    data() {
      return {
        tenSecondWatch:null,
        followStatus:true,
        startLocate:false,
        floorList:null,
        currentFloorIndex:null,
        locateFloorIndex:null,
        mapInfo:null,
        map:null,
        dolocate:false,
        regionId:'14443871894123339',
        parkingUnitId:null,
        parkingFloorIndex:null,
        enableError:false,
        needConfirm:false,
        first:true,
        locatedFailedCount:0,
        blueToothAlert:false,
        inparkingLotAlert:false,
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

      window.MapVm = this

      if (this.$route.query.unit) {

        this.parkingUnitId = decodeURI(this.$route.query.unit)
      }

      if (this.$route.query.floor) {

        this.parkingFloorIndex = parseInt(decodeURI(this.$route.query.floor))
      }

      if (this.$route.query.debug) {

        idrLocateServerInstance.debug = true
      }

      this.regionId = "14443871894123339"

      this.initMap()

      idrDebug.showDebugInfo(false)

      idrDebug.debugInfo("测试")
    },
    destroyed() {

      this.map.release()
    },
    methods:{
      updateBluetoothState(on) {

        idrDebug.debugInfo(on)

        if (!on) {

          this.blueToothAlert = true
        }
        else {

          if (this.locatedFailedCount > 3) {

            this.inparkingLotAlert = true
          }
          else {

            this.beginFindCar()
          }
        }
      },
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

        this.map.addEventListener(idrMapEvent.types.onMapStatusChange, (data) => {

          this.onMapStatusChange(data)
        })
      },
      tellNativeRouterSuccess() {

        if (idrCoreMgr.isAndroid) {

          if (window.android.startNavigate) {

            window.android.startNavigate()
          }
        }
        else {

          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.startNavigate) {

            window.webkit.messageHandlers.startNavigate.postMessage({})
          }
        }
      },
      onRouterSuccess({start, end}, findcar = true) {

        this.tellNativeRouterSuccess()

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

        this.stopRouteAndClean()
      },
      doChangeFloor(floorIndex) {

        this.map.autoChangeFloor = false

        this.map.set2DMap(true)

        this.map.changeFloor(floorIndex)
      },
      onInitMapSuccess(mapInfo) {

        document.title = mapInfo.name

        this.mapInfo = mapInfo

        this.floorList = mapInfo.floorList

        const unit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.changeFloor(unit.floorIndex)
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

        this.map.showCurrFloor()
      },
      checkBlutToothState() {

        if (idrCoreMgr.isAndroid) {

          if (window.android.isBlueToothOn) {

            window.android.isBlueToothOn()
          }
        }
        else {

          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.isBlueToothOn) {

            window.webkit.messageHandlers.isBlueToothOn.postMessage({})
          }
        }
      },
      beginFindCar(){

        if (this.locatedFailedCount > 3) {

          this.checkBlutToothState()

          return
        }

        const unit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.doRoute({end:unit})
          .then(res=>{

            this.followStatus = true

            this.onRouterSuccess(res)
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

        this.locatedFailedCount = 0
      },
      closeBlueToothAlert() {

        this.blueToothAlert = false
      },
      goToSettingBlutTooth() {

        this.blueToothAlert = false

        if (idrCoreMgr.isAndroid) {

          if (window.android.setupBlueTooth) {

            window.android.setupBlueTooth()
          }
        }
        else {

          if (window.webkit.messageHandlers && window.webkit.messageHandlers.setupBlueTooth) {

            window.webkit.messageHandlers.setupBlueTooth.postMessage({})
          }
        }
      },
      onLocateFailed(){

        this.locatedFailedCount += 1

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
      onMapStatusChange({status}) {

        if (this.map.isInNavi() && status == 0) {

          this.followStatus = false

          this.beginTenSecondWatch()
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
      },
      stopRouteAndClean() {

        this.map.stopRoute()

        this.$store.dispatch('stopNavigation')
          .then(()=>{

            this.map.setStatus(YFM.Map.STATUS_TOUCH)

            this.delegateToNativeLayerOfStopRoute()
          })
      },
      delegateToNativeLayerOfStopRoute() {

        if (idrCoreMgr.isAndroid) {

          if (window.android.endNavigate) {

            window.android.endNavigate()
          }
        }
        else {

          if (window.webkit.messageHandlers && window.webkit.messageHandlers.endNavigate) {

            window.webkit.messageHandlers.endNavigate.postMessage({})
          }
        }
      },
      onShowCarPos() {

        let unit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.centerPos(unit.position, true)

        this.setMapInNormal()
      },
      beginTenSecondWatch() {

        if (this.map.isInNavi()) {

          clearTimeout(this.tenSecondWatch)

          this.tenSecondWatch = setTimeout(()=>{

            this.setMapInNavigate()

          }, 5 * 1000)
        }
      },
      setMapInNormal() {

        this.map.setStatus(YFM.Map.STATUS_TOUCH)

        this.followStatus = false

        this.beginTenSecondWatch()
      },
      setMapInNavigate() {

        this.followStatus = true

        this.map.set2DMap(true)

        this.map.setStatus(YFM.Map.STATUS_NAVIGATE)

        this.currentFloorIndex = this.map.getUserPos().floorIndex
      },
      onShowAllFloor() {

        this.setMapInNormal()

        this.currentFloorIndex = -1

        this.map.showAllFloor()
      },
      birdLook() {

        if (this.map._naviParm.end.position.floorIndex == this.map.getUserPos().floorIndex) {

          this.map.birdLook()

          this.setMapInNormal()
        }
        else {

          this.onShowAllFloor()
        }
      }
    }
  }
</script>
<style scoped lang="scss">

.container {

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 90%;
  margin: auto;
  z-index: 0;
  pointer-events:none;
}

</style>
