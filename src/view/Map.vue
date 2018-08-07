<template>
  <div>
    <div id="map" class="page"></div>
    <find-car-btn v-if="!mapState.markInMap && !navigation.start" @find-car="beginFindCar"></find-car-btn>
    <zoom v-bind:map="map"></zoom>
    <public-facility-btn v-on:onclick='showFacilityPanel = true' v-if="!mapState.markInMap && !navigation.start"></public-facility-btn>
    <locate-status-control :dolocate="dolocate" @onclick="doLocating"></locate-status-control>
    <find-car-with-plate-number v-if="mapState.searchCarWithPlate" v-on:navigatetocar="navigateToCar" v-bind:initcarno="carno" :region-id="regionId"></find-car-with-plate-number>
    <find-car-with-unit v-bind:map="map" v-if="mapState.searchCarWithUnit"></find-car-with-unit>
    <facility-panel v-if="showFacilityPanel" v-bind:map="map" @onnavigateto="onNavigateTo" @onclose="showFacilityPanel = false"></facility-panel>
    <navigation v-if='navigation.start' @toggleSpeak="toggleSpeak" v-on:stop="onStopNavigate" @birdlook="onBirdLook" @followme="onFollowMe"></navigation>
    <mark-in-map v-if="mapState.markInMap"></mark-in-map>
  </div>
</template>

<script>

  // import '@/yfmap.min'
  import { idrMapView , networkInstance, idrMarkers, idrMapEventTypes, idrDebug } from '../../../indoorunMap/map'

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

  export default {
    name: "Map",
    components: {
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
      }
    },
    computed: {
      ...mapGetters([
        'mapState',
        'navigation'
      ])
    },
    mounted() {

      const parkCode = this.$route.query.parkCode || "th0732"

      this.carno = this.$route.query.carNo

      networkInstance.getRegionIdByParkCode(parkCode)
        .then(({regionId})=>{

          this.regionId = regionId

          this.initMap(regionId)
        })
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

        this.$store.dispatch('finishMarkInMap')
          .then(()=>{

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
      onNaviToOuter() {

        let units = this.regionEx.findUnitsWithType([5])

        console.log(units)

        if (!('5' in units)) {

          return
        }

        let btns = units[5].map(unit=>{

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

          const unit = this.regionEx.findNearUnit(this.map.getUserPos(), units[unitType])

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

        if (this.carno) {

          this.$store.dispatch('startSearchCarByPlateNumber')
            .catch(e=>{
              console.log(e)
            })
        }
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
      navigateToCar({unitId}) {

        var unit = this.map.findUnitWithId(unitId)

        this.addEndMarker(unit.position)

        this.map.doRoute(null, unit.position)
          .then(res=>{

            return this.onRouterSuccess(res)
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

          this.map.doLocation(pos => this.onLocateSuccess(pos), msg => {

            this.onLocateFailed(msg)
          })
            .catch(msg=>{

              HeaderTip.show(msg)
            })
        }
      },
      onLocateSuccess(pos){

        this.map.setUserPos(pos)

        this.locateFloorId = pos.floorId
      },
      onLocateFailed(msg){

        HeaderTip.show(msg)
      },
      onSelect(val) {

        this.currentFloorId = val

        this.map.changeFloor(val)

        this.map.autoChangeFloor = false
      },
      onMapClick(pos) {

        if (window.debugtest) {

          this.map.setUserPos(pos)
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

        this.audio.src = 'https://wx.indoorun.com/thxz/pc/speech?text=' + text

        this.audio.play()

        this.audioTime = date
      },
      onNaviStatusUpdate({validate, projDist, goalDist, serialDist, nextSug}) {

        if (!validate) {

          return
        }

        if (projDist >= 150) {

          this.map.reRoute()

          return
        }

        const totalDistance = Math.ceil(goalDist/10.0)

        const nextDistance = Math.ceil(serialDist/10.0)

        this.$store.dispatch('setNaviStatus', {nextLeft:YFM.Map.Navigate.NextSuggestion.LEFT == nextSug, totalDistance, nextDistance})

        if (totalDistance < 15) {

          this.playAudio('您已到达目的地')

          var confirm = {name:'知道了', callback:() => {

              window.Alertboxview.hide()

              this.stopRouteAndClean()
            }}

          window.Alertboxview.show('您已到达目的地', null, [confirm])
        }
        else  {

          const leftrighttext = YFM.Map.Navigate.NextSuggestion.LEFT == nextSug ? '左转' : '右转'

          const text = '前方' + nextDistance + '米' + leftrighttext

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
