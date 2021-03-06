<template>
  <div @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div id="map" class="page"></div>
    <!--<assist-bar @showCarPos="onShowCarPos"></assist-bar>-->
    <find-car-btn v-if="!navigation.start && !first" @find-car="checkBlutToothState" :unit="parkingUnit"></find-car-btn>
    <navigation v-if='navigation.start && navigation.statusValid' v-on:stop="onStopNavigate" @birdlook="birdLook" :followStatus="followStatus" @changeToNavigate="setMapInNavigate"></navigation>
    <floor-list-control v-if="floorList" :innavi="navigation.start" :firstload="firstload" @show-all-floor="onShowAllFloor" @on-select="doChangeFloor" :showallfloor="currentFloorIndex == -1" :floor-list="floorList" :located-index="locateFloorIndex" :selected-floorname="selectedFloorName"></floor-list-control>
    <locate-status-control v-if="floorList" :dolocate="dolocate" @onclick="doLocating"></locate-status-control>
    <not-in-parking-lot v-if="inparkingLotAlert" @do-confirm="inparkingLotAlert = false"></not-in-parking-lot>
    <blue-tooth-off v-if="blueToothAlert && !navigation.start" @do-cancel="closeBlueToothAlert" @do-confirm="goToSettingBlutTooth"></blue-tooth-off>
    <blue-tooth-off-in-navi v-if="blueToothAlert && navigation.start" @do-confirm="stopRouteAndClean"></blue-tooth-off-in-navi>
    <div class="loading" v-show="isLoading">
      <img src="../assets/loading.gif"/>
    </div>

  </div>
</template>

<script>

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
  import LocateStatusControl from "@/components/LocateStatusControl";

  export default {
    name: "Map",
    components: {
      LocateStatusControl,
      BlueToothOffInNavi,
      BlueToothOff,
      NotInParkingLot,
      AssistBar,
      FloorListControl,
      navigation,
      FindCarBtn},
    data() {
      return {
        isLoading:true,
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
        enableError:false,
        needConfirm:false,
        first:true,
        locatedFailedCount:0,
        blueToothAlert:false,
        inparkingLotAlert:false,
        parkingUnit:null,
        confirmObj:{start:null, end:null},
        firstload:true
      }
    },
    computed: {
      ...mapGetters([
        'mapState',
        'navigation'
      ]),
      selectedFloorName() {

        if (this.currentFloorIndex != -1) {

          let floor = this.mapInfo.getFloorByIndex(this.currentFloorIndex)

          return floor.name
        }

        return null
      }
    },
    mounted() {

      window.MapVm = this

      if (this.$route.query.unit) {

        this.parkingUnitId = decodeURI(this.$route.query.unit)
      }

      if (this.$route.query.debug) {

        idrLocateServerInstance.debug = true
      }

      this.regionId = "14443871894123339"

      this.initMap()
    },
    destroyed() {

      this.map.release()
    },
    methods:{
      onTouchStart() {

        clearTimeout(this.tenSecondWatch)
      },
      onTouchEnd(){

        this.beginTenSecondWatch()
      },
      updateBluetoothState(on) {

        if (idrLocateServerInstance.debug) {

          this.beginFindCar()

          return
        }

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
      onShowAlertView(show) {

        if (idrCoreMgr.isAndroid) {

          if (window.android.onShowAlertView) {

            window.android.onShowAlertView(show)
          }
        }
        else {

          if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.onShowAlertView) {

            window.webkit.messageHandlers.onShowAlertView.postMessage({show:show})
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

        this.map.addEventListener(idrMapEvent.types.onMapClick, (data) => {

          this.onMapClick(data)
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

        this.parkingUnit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.changeFloor(this.parkingUnit.floorIndex)
      },
      onFirstShowFloor() {

        this.doLocating()

        this.floorList = this.mapInfo.floorList

        const unit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.addUnitsOverlay([unit], './static/parkingcar.png')

        setTimeout(()=>{

          this.map.autoChangeFloor = false

          this.map.centerPos(unit.position, true)

          this.firstload = false
        }, 500)
      },
      onFloorChangeSuccess({floorIndex}) {

        this.isLoading = false

        this.currentFloorIndex = floorIndex

        if (this.first) {

          this.onFirstShowFloor()

          this.first = false
        }
        else {

          this.map.showCurrFloor()
        }
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

        if (this.locatedFailedCount > 3 && idrLocateServerInstance.debug == false) {

          this.checkBlutToothState()

          return
        }

        const unit = this.map.findUnitWithId(this.parkingUnitId)

        this.map.doRoute({end:unit})
          .then(res=>{

            this.followStatus = true

            this.onRouterSuccess(res)
          })
          .catch(()=>{

            this.inparkingLotAlert = true
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

        if (false) {

          idrLocateServerInstance.debugPos = pos

          console.log(pos)
        }
      },
      onMapStatusChange({status}) {

        if (this.map.isInNavi() && status == 0) {

          this.followStatus = false

          this.beginTenSecondWatch()
        }
      },
      onNaviStatusUpdate({validate, projDist, globalDist, goalDist, serialDist, nextSug}) {

        if (!validate || this.needConfirm) {

          return
        }

        if (projDist >= 120) {

          this.map.reRoute()

          return
        }

        const totalDistance = Math.ceil(globalDist/10.0)

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

        if (nextSug == YFM.Map.Navigate.NextSuggestion.ARRIVE) {

          if (Math.abs(goalDist - globalDist) < 1) {

            nextdir = 3
          }
          else {

            nextdir = 2
          }
        }

        var inTargetFloor = this.map.checkInTargetFloor()

        this.$store.dispatch('setNaviStatus', {nextdir, totalDistance, nextDistance, inTargetFloor})
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

        this.doChangeFloor(unit.floorIndex)

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

        clearTimeout(this.tenSecondWatch)
      },
      onShowAllFloor(show = true) {

        if (show) {

          this.setMapInNormal()

          this.preselectedFloor = this.currentFloorIndex

          this.currentFloorIndex = -1

          this.map.showAllFloor()
        }
        else {

          this.currentFloorIndex = this.preselectedFloor

          this.doChangeFloor(this.preselectedFloor)
        }
      },
      birdLook() {

        if (this.map._naviParm.end.position.floorIndex == this.map.getUserPos().floorIndex) {

          this.map.birdLook()

          this.setMapInNormal()
        }
        else {

          this.onShowAllFloor(true)
        }
      }
    },
    watch:{

      inparkingLotAlert:function(newvalue) {

        this.onShowAlertView(newvalue || this.blueToothAlert)
      },
      blueToothAlert:function (newValue) {

        this.onShowAlertView(newValue || this.inparkingLotAlert)
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

  .loading {

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
