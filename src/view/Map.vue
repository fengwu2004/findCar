<template>
  <div>
    <div id="map" class="page"></div>
    <find-car-btn v-if="!mapState.markInMap && !navigation.start" @find-car="beginFindCar"></find-car-btn>
    <locate-status-control :dolocate="dolocate" @onclick="doLocating"></locate-status-control>
    <!--<floor-list-control :floorlist="floorList" :currentName="currentFloorName" :selectfloorid="currentFloorId" :locatefloorid="locateFloorId" v-on:onselect="onSelect"></floor-list-control>-->
    <find-car-with-plate-number v-if="mapState.searchCarWithPlate" v-on:navigatetocar="navigateToCar" v-bind:initcarno="carno"></find-car-with-plate-number>
    <find-car-with-unit v-bind:map="map" v-if="mapState.searchCarWithUnit"></find-car-with-unit>
    <public-facility-btn v-on:onclick='showFacilityPanel = true' v-if="!mapState.markInMap && !navigation.start"></public-facility-btn>
    <facility-panel v-if="showFacilityPanel" v-bind:map="map" @onnavigateto="onNavigateTo" @onclose="showFacilityPanel = false"></facility-panel>
    <navigation v-if='navigation.start' v-on:stop="onStopNavigate" @birdlook="birdLook"></navigation>
    <mark-in-map v-if="mapState.markInMap"></mark-in-map>
    <zoom v-bind:map="map"></zoom>
  </div>
</template>


<script>

  import { idrMapView , networkInstance, idrMarkers, idrMapEventTypes } from '../../../indoorunMap/map'

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

  window.debugtest = true

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
        carno:'',
        endMarker:null,
        audio:null
      }
    },
    computed: {
      ...mapGetters([
        'mapState',
        'navigation'
      ])
    },
    mounted() {

      this.map = new idrMapView()

      this.map.initMap('yf1248331604', 'map', this.regionId)

      this.map.addEventListener(idrMapEventTypes.onFloorChangeSuccess, data => {

        this.onFloorChangeSuccess(data)
      })

      this.map.addEventListener(idrMapEventTypes.onInitMapSuccess, regionEx => {

        this.onInitMapSuccess(regionEx)
      })

      this.map.addEventListener(idrMapEventTypes.onRouterFinish, () => {

        this.onRouterFinish()
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
    methods:{
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

            window.Toast.show(res)
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
      birdLook() {

        this.map.birdLook()
      },
      onStopNavigate() {

        if (!this.navigation.findCar) {

          this.map.stopRoute()

          return
        }

        var unfind = {name:'未找到爱车', callback:()=> {

            Alertboxview.hide()

            this.map.stopRoute()
          }}

        var found = {name:'已找到爱车', callback:()=> {

            Alertboxview.hide()

            this.map.stopRoute()
          }}

        var cancel = {name:'取消', callback:() => {

            Alertboxview.hide()
          }}

        Alertboxview.show('在中断导航前', '是否已找到您的爱车', [unfind, found, cancel])
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

                window.Toast.show(res)
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

        this.$store.dispatch('startSearchCarByPlateNumber').catch(e=>console.log(e))
      },
      navigateToCar({unitId}) {

        var unit = this.map.findUnitWithId(unitId)

        this.addCarMarker(unit)

        this.map.doRoute(null, unit.getPos())
          .then(res=>{

            return this.onRouterSuccess(res)
          })
          .catch(res=>{

            window.Toast.show(res)
          })
      },
      doLocating() {

        if (this.map.getUserPos()) {

          this.dolocate = true

          this.map.centerPos(this.map.getUserPos(), false)

          this.map.autoChangeFloor = true
        }
        else {

          this.map.doLocation((pos)=>{this.onLocateSuccess(pos)}, msg=>{

            this.onLocateFailed(msg)
          })
            .catch(msg=>{

              Toast.show(msg)
            })
        }
      },
      onLocateSuccess(pos){

        this.map.setUserPos(pos)

        this.locateFloorId = pos.floorId
      },
      onLocateFailed(msg){

        Toast.show(msg)
      },
      onSelect(val) {

        this.currentFloorId = val

        this.map.changeFloor(val)

        this.map.autoChangeFloor = false
      },
      onSelectCar(car) {

        var unit = this.map.findUnitWithId(car.unitId)

        this.addCarMarker(unit)

        this.map.doRoute(null, unit.getPos())
          .then(res=>{

            return this.onRouterSuccess(res)
          })
          .catch(res=>{

            window.Toast.show(res)
          })

        this.show = false
      },
      onMapClick(pos) {

        if (window.debugtest) {

          this.map.setUserPos(pos)
        }
      },
      addCarMarker(unit) {

        var pos = unit.position

        networkInstance.saveMarkedUnit(unit, null, null)

        this.endMarker = this.doAddCarMarker(pos)

        this.map.centerPos(pos, false)
      },
      playAudio(text) {

        this.audio = new Audio()

        this.audio.src = 'https://wx.indoorun.com/thxz/pc/speech?text=' + text

        this.audio.play()
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

        const leftrighttext = YFM.Map.Navigate.NextSuggestion.LEFT == nextSug ? '左转' : '右转'

        const text = '前方' + nextDistance + '米' + leftrighttext

        this.playAudio(text)

        this.$store.dispatch('setNaviStatus', {nextLeft:YFM.Map.Navigate.NextSuggestion.LEFT == nextSug, totalDistance, nextDistance})
          .catch(res=>{

            console.log(res)
          })

        if (totalDistance < 15) {

          var confirm = {name:'知道了', callback:() => {

              window.Alertboxview.hide()

              this.map.stopRoute()
            }}

          window.Alertboxview.show('您已到达目的地', null, [confirm])
        }
      },
      onRouterFinish() {

        this.$store.dispatch('stopNavigation')
          .then(()=>{

            this.map.removeMarker(this.endMarker)

            this.map.setStatus(YFM.Map.STATUS_TOUCH)
          })
      },
      doAddCarMarker(pos) {

        var IDRCarMarker = idrMarkers.IDRCarMarker

        var endMarker = new IDRCarMarker(pos, './static/markericon/car.png')

        map.addMarker(endMarker)

        return endMarker
      },
      addEndMarker(pos) {

        this.map.removeMarker(this.endMarker)

        var endMarker = new idrMarkers.IDREndMarker(pos, './static/markericon/end.png')

        this.endMarker = this.map.addMarker(endMarker)
      },
    }
  }
</script>
<style scoped lang="scss">

  @import "app.css";
  @import "indoorun.css";

</style>
