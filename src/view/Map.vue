<template>
  <div>
    <div id="map" class="page"></div>
    <find-car-btn v-if="!mapState.markInMap && !navigation.start && !needConfirm" @find-car="beginFindCar"></find-car-btn>
    <zoom v-bind:map="map"></zoom>
    <public-facility-btn v-on:onclick='showFacilityPanel = true' v-if="!mapState.markInMap && !navigation.start && !needConfirm"></public-facility-btn>
    <locate-status-control :dolocate="dolocate" @onclick="onLocateClick"></locate-status-control>
    <find-car-with-plate-number v-if="mapState.searchCarWithPlate" v-on:navigatetocar="navigateToCar" v-bind:initcarno="carno" :region-id="regionId"></find-car-with-plate-number>
    <find-car-with-unit @onfindunits="navigateToCar" v-bind:map="map" v-if="mapState.searchCarWithUnit"></find-car-with-unit>
    <facility-panel v-if="showFacilityPanel" v-bind:map="map" @onnavigateto="onNavigateTo" @onclose="showFacilityPanel = false"></facility-panel>
    <navigation v-if='navigation.start' @toggleSpeak="toggleSpeak" v-on:stop="onStopNavigate" @birdlook="onBirdLook" @followme="onFollowMe"></navigation>
    <confirm-navigate-bar @confirmNavigate="handleConfirmNavigate" v-if="needConfirm"></confirm-navigate-bar>
    <mark-in-map v-if="mapState.markInMap"></mark-in-map>
  </div>
</template>

<script>

  // import '@/yfmap.min'
  import {
    idrMapView,
    networkInstance,
    idrMarkers,
    idrMapEventTypes,
    idrLocateServerInstance,
    idrWxManager
  } from '../../../indoorunMap/map'

  import MarkInMap from '@/components/MarkInMap'
  import FloorListControl from '@/components/FloorListControl.vue'
  import LocateStatusControl from '@/components/LocateStatusControl.vue'
  import navigation from '@/components/navigation.vue'
  import FindCarWithPlateNumber from '@/components/FindCarWithPlateNumber.vue'
  import FindCarWithUnit from '@/components/FindCarWithUnit.vue'
  import FindCarBtn from "@/components/findCarBtn";
  import PublicFacilityBtn from '@/components/PublicFacilityBtn'
  import FacilityPanel from '@/components/FacilityPanel'
  import { mapGetters } from 'vuex'
  import Zoom from "@/components/Zoom";
  import { Indicator } from 'mint-ui';
  import ConfirmNavigateBar from "@/components/ConfirmNavigateBar";

  export default {
    name: "Map",
    components: {
      ConfirmNavigateBar,
      MarkInMap,
      Zoom,
      FloorListControl,
      LocateStatusControl,
      navigation,
      FindCarWithPlateNumber,
      FindCarWithUnit,
      FindCarBtn,
      PublicFacilityBtn,
      FacilityPanel},
    data() {
      return {
        showFacilityPanel:false,
        startLocate:false,
        floorList:[],
        currentFloorName:'',
        currentFloorId:null,
        locateFloorId:null,
        regionEx:null,
        map:null,
        dolocate:false,
        regionId:'15313792400143094',
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

      const regionId = this.$route.query.regionId

      this.carno = this.$route.query.carNo

      if (this.carno && this.carno.length > 4) {

        this.willnavigatecar = true
      }

      if (regionId) {

        this.regionId = regionId

        this.initMap()
      }
      else {

        const parkCode = this.$route.query.parkCode

        networkInstance.getRegionIdByParkCode(parkCode)
          .then(({regionId})=>{

            this.regionId = regionId

            this.initMap()
          })
      }
    },
    methods:{
      initMap() {

        this.map = new idrMapView()

        this.map.initMap('yf1248331604', 'map', this.regionId)

        this.map.addEventListener(idrMapEventTypes.onFloorChangeSuccess, data => {

          this.onFloorChangeSuccess(data)
        })

        this.map.addEventListener(idrMapEventTypes.onInitMapSuccess, regionEx => {

          this.onInitMapSuccess(regionEx)
        })

        this.map.addEventListener(idrMapEventTypes.onNaviStatusUpdate, (data) => {

          this.onNaviStatusUpdate(data)
        })

        this.map.addEventListener(idrMapEventTypes.onMapClick, (pos) => {

          this.onMapClick(pos)
        })

        this.map.addEventListener(idrMapEventTypes.onUnitClick, (unit) => {

          this.onUnitClick(unit)
        })
      },
      onUnitClick(unit) {

        if (!this.mapState.markInMap) {

          return
        }

        this.addEndMarker(unit.position)

        this.$store.dispatch('finishMarkInMap')
          .then(()=>{

            if (!idrWxManager._beaconStart) {

              return Promise.reject('蓝牙未开启，请开启蓝牙')
            }

            return this.map.doRoute(null, unit.position)
          })
          .then((res)=>{

            return this.onRouterSuccess(res)
          })
          .catch(res=>{

            window.HeaderTip.show(res)
          })
      },
      onRouterSuccess({start, end}, findcar = true) {

        return new Promise((resolve => {

          this.$store.dispatch('startNavigation', findcar)
            .then(()=>{

              this.addEndMarker(end)

              this.map.changeFloor(start.floorId)

              this.map.birdLook()

              this.map.setStatus(YFM.Map.STATUS_NAVIGATE)

              resolve()
            })
        }))
      },
      onBirdLook() {

        this.map.birdLook()

        this.map.setStatus(YFM.Map.STATUS_TOUCH)
      },
      onFollowMe() {

        this.map.setStatus(YFM.Map.STATUS_NAVIGATE)
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
      onNaviToUnit(unit) {

        this.preparePlayAudio()

        this.map.doRoute(null, unit.position)
          .then(res=>{

            return this.onRouterSuccess(res, false)
          })
          .catch(res=>{

            window.HeaderTip.show(res)
          })
      },
      onNaviToOuter() {

        let units = this.regionEx.findUnitsWithType([5])

        console.log(units)

        if (!('5' in units)) {

          return
        }

        let outers = units[5].filter(unit=>{

          if (unit.extInfo && unit.extInfo.outerExit == true) {

            return true
          }

          return false
        })

        let btns = outers.map(unit=>{

          return {
            name:unit.name, callback:()=>{

              Alertboxview.hide()

              this.onNaviToUnit(unit)
            }
          }
        })

        btns.push({name:'取消', callback:() => {

            Alertboxview.hide()
          }})

        Alertboxview.show('离场引导', null, btns)
      },
      onNavigateTo(unitType) {

        this.showFacilityPanel = false

        const units = this.regionEx.findUnitsWithType([unitType])

        if (unitType in units) {

          let unit = null

          if (unitType == '5') {

            let outers = units[unitType].filter(unit=>{

              if (unit.extInfo && unit.extInfo.outerExit == true) {

                return true
              }

              return false
            })

            unit = this.map.findNearUnit(this.map.getUserPos(), outers, true)
          }
          else {

            unit = this.regionEx.findNearUnit(this.map.getUserPos(), units[unitType])
          }

          if (unit) {

            this.map.doRoute(null, unit.position)
              .then(res=>{

                return this.onRouterSuccess(res, false)
              })
              .catch(res=>{

                window.HeaderTip.show(res)
              })
          }
        }
      },
      onInitMapSuccess(regionEx) {

        document.title = regionEx.name

        this.regionEx = regionEx

        this.floorList = regionEx.floorList

        this.map.changeFloor(regionEx.floorList[0].id)
      },
      onFloorChangeSuccess({floorId}) {

        this.currentFloorId = floorId

        if (!this.startLocate) {

          this.doLocating()

          this.startLocate = true
        }

        this.currentFloorName = this.getCurrentName()

        this.map.addUnit(this.regionEx.getFloorbyId(floorId).unitList)
      },
      getCurrentName() {

        for (var i = 0; i < this.floorList.length; ++i) {

          if (this.floorList[i].id === this.currentFloorId) {

            return this.floorList[i].name
          }
        }

        return null
      },
      beginFindCar(){

        if (this.endMarker) {

          if (!idrWxManager._beaconStart) {

            window.HeaderTip.show('蓝牙未开启，请开启蓝牙')

            return
          }

          this.map.doRoute(null, this.endMarker.position)
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

        this.preparePlayAudio()

        this.onRouterSuccess(this.confirmObj)

        this.needConfirm = false
      },
      doBirdLookFirst(res) {

        this.confirmObj = res

        this.needConfirm = true
      },
      navigateToCar({id:unitId}, birdLookFirst = false) {

        var unit = this.map.findUnitWithId(unitId)

        this.addEndMarker(unit.position)

        this.map.centerPos(unit.position)

        this.map.doRoute(null, unit.position)
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
      onLocateClick() {

        this.enableError = true

        this.doLocating()
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

        networkInstance.getParkingPlaceUnitByCarNo(this.carno.toUpperCase(), this.regionId)
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

        this.locateFloorId = pos.floorId

        if (this.willnavigatecar) {

          this.dofindCarWhenLocateSuccess()

          this.willnavigatecar = false
        }
      },
      onLocateFailed(msg){

        if (this.enableError) {

          HeaderTip.show("当前位置蓝牙信号较少，请耐心等待")

          this.enableError = false
        }
      },
      onSelect(val) {

        this.currentFloorId = val

        this.map.changeFloor(val)

        this.map.autoChangeFloor = false
      },
      onMapClick(pos) {

        if (window.debugtest) {

          idrLocateServerInstance.debugPos = pos
        }
      },
      preparePlayAudio() {

        if (!this.audio) {

          this.audio = new Audio()
        }
      },
      playAudio(text) {

        if (!text) {

          return
        }

        const date = new Date().getTime()

        if (date - this.audioTime < 5000) {

          return
        }

        if (!this.audio) {

          this.preparePlayAudio()
        }

        this.audio.src = 'https://wx.indoorun.com/thxz/pc/speech?text=' + text

        this.audio.play()

        this.audioTime = date
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
        else  {

          var dir = ''

          if (nextdir == 0) {

            dir = '左转'
          }

          if (nextdir == 1) {

            dir = '右转'
          }

          if (nextdir == 2) {

            dir = '直行'
          }

          const text = '前方' + nextDistance + '米' + dir

          this.playAudio(text)
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

        var endMarker = new idrMarkers.IDREndMarker(pos, './static/markericon/end.png')

        this.endMarker = this.map.addMarker(endMarker)
      },
      toggleSpeak() {

        this.$store.dispatch('toggleSpeak')
      }
    }
  }
</script>
<style scoped lang="scss">



</style>
