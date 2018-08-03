<template>
  <div>
    <div id="map" class="page"></div>
    <zoom v-bind:map="map"></zoom>
    <empty-space-list></empty-space-list>
    <empty-space-detail v-show="showDetail" :unit="clickedUnit" v-bind:enable-navi="enableNavi || isWx" @onNavi="onNaviToUnit" @onClose="showDetail = false"></empty-space-detail>
    <locate-status-control :dolocate="dolocate" @onclick="doLocating" v-show="enableNavi || isWx"></locate-status-control>
    <navigation v-if='navigation.start' v-on:stop="onStopNavigate" @birdlook="birdLook"></navigation>
    <!--<floor-list-control :floorlist="floorList" :currentName="currentFloorName" :selectfloorid="currentFloorId" :locatefloorid="locateFloorId" v-on:onselect="onSelect"></floor-list-control>-->
  </div>
</template>


<script>

  // import '@/yfmap.min'
  import { idrMapView , idrMarkers, networkInstance, idrMapEventTypes } from '../../../indoorunMap/map'
  import FloorListControl from '@/components/FloorListControl.vue'
  import { mapGetters } from 'vuex'
  import Zoom from "@/components/Zoom";
  import EmptySpaceList from "@/components/EmptySpaceList";
  import EmptySpaceDetail from "@/components/EmptySpaceDetail";
  import Navigation from "@/components/navigation";
  import LocateStatusControl from "@/components/LocateStatusControl";

  export default {
    name: "EmptySpace",
    components: {
      LocateStatusControl,
      Navigation,
      EmptySpaceDetail,
      EmptySpaceList,
      Zoom,
      FloorListControl,
      },
    data() {
      return {
        dolocate:false,
        floorList:[],
        currentFloorName:'',
        currentFloorId:null,
        locateFloorId:null,
        regionEx:null,
        map:null,
        regionId:'15313792400143094',
        enableNavi:false,
        showDetail:false,
        audioTime:0,
        audio:null,
        endMarker:null,
        isWx:false,
        clickedUnit:{
          spaceStatus:true,
          name:"0055",
          fakeName:"VIP"
        }
      }
    },
    computed: {
      ...mapGetters([
        'mapState',
        'navigation',
        'parkingdetail'
      ])
    },
    mounted() {

      let userAgent = window.navigator.userAgent.toLowerCase();

      this.isWx = userAgent.match(/MicroMessenger/i) == 'micromessenger'

      const {parkCode, regionId} = this.$route.query

      if (regionId) {

        this.regionId = regionId

        this.initMap(regionId)
      }
      else {

        networkInstance.getRegionIdByParkCode(parkCode)
          .then(({regionId})=>{

            this.regionId = regionId

            this.initMap(regionId)
          })
      }
    },
    methods:{
      preparePlayAudio() {

        if (!this.audio) {

          this.audio = new Audio()
        }
      },
      initMap(){

        this.map = new idrMapView()

        this.map.initMap('yf1248331604', 'map', this.regionId)

        this.map.addEventListener(idrMapEventTypes.onFloorChangeSuccess, data => {

          this.onFloorChangeSuccess(data)
        })

        this.map.addEventListener(idrMapEventTypes.onInitMapSuccess, regionEx => {

          this.onInitMapSuccess(regionEx)
        })

        this.map.addEventListener(idrMapEventTypes.onUnitClick, (unit) => {

          this.onUnitClick(unit)
        })

        this.map.addEventListener(idrMapEventTypes.onMapClick, (pos) => {

          this.onMapClick(pos)
        })

        this.map.addEventListener(idrMapEventTypes.onRouterFinish, () => {

          this.onRouterFinish()
        })

        this.map.addEventListener(idrMapEventTypes.onNaviStatusUpdate, (data) => {

          this.onNaviStatusUpdate(data)
        })
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

              this.map.stopRoute()
            }}

          window.Alertboxview.show('您已到达目的地', null, [confirm])
        }
        else  {

          const leftrighttext = YFM.Map.Navigate.NextSuggestion.LEFT == nextSug ? '左转' : '右转'

          const text = '前方' + nextDistance + '米' + leftrighttext

          this.playAudio(text)
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
      onRouterFinish() {

        this.$store.dispatch('stopNavigation')
          .then(()=>{

            this.map.removeMarker(this.endMarker)

            this.map.setStatus(YFM.Map.STATUS_TOUCH)
          })
      },
      onMapClick(pos) {

        if (window.debugtest) {

          this.map.setUserPos(pos)
        }
      },
      onUnitClick(unit) {

        if (unit.fakeName == undefined) {

          return
        }

        this.clickedUnit = unit

        this.showDetail = true
      },
      onNaviToUnit(unit) {

        this.preparePlayAudio()

        this.showDetail = false

        this.map.doRoute(null, unit.position)
          .then(res=>{

            return this.onRouterSuccess(res, false)
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

          this.map.doLocation(pos => this.onLocateSuccess(pos), msg => {

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

            this.playAudio('已找到爱车')
          }}

        var cancel = {name:'取消', callback:() => {

            Alertboxview.hide()
          }}

        Alertboxview.show('在中断导航前', '是否已找到您的爱车', [unfind, found, cancel])
      },
      onInitMapSuccess(regionEx) {

        document.title = regionEx.name

        this.regionEx = regionEx

        this.floorList = regionEx.floorList

        this.map.changeFloor(regionEx.floorList[0].id)
      },
      updateUnits(regionEx, {spaceOverviewList}) {

        console.log(spaceOverviewList)

        spaceOverviewList.forEach(({spaceType, spaceList})=>{

          spaceList.forEach(({floorId, unitId, carNo, spaceStatus})=> {

            let unit = regionEx.getUnitById(floorId, unitId)

            if (unit) {

              unit.fakeName = spaceType

              unit.carNo = carNo

              unit.spaceStatus = spaceStatus
            }
          })
        })
      },
      onFloorChangeSuccess({floorId}) {

        if (!this.startLocate) {

          this.doLocating()

          this.startLocate = true
        }

        this.currentFloorId = floorId

        this.currentFloorName = this.getCurrentName()

        networkInstance.parksOverview(this.regionId)
          .then(res=>{

            if (res.data.length > 0) {

              return this.$store.dispatch('setParkingDetail', res.data[0])
            }

            return Promise.reject(null)
          })
          .then(()=>{

            this.updateUnits(this.regionEx, this.parkingdetail)

            this.map.clearFloorUnitsColor()

            this.map.updateUnitsColor(this.regionEx.getAllUnits())
          })
          .finally(()=>{

            this.map.addUnit(this.regionEx.getFloorbyId(floorId).unitList)
          })
      },
      getCurrentName() {

        for (var i = 0; i < this.floorList.length; ++i) {

          if (this.floorList[i].id === this.currentFloorId) {

            return this.floorList[i].name
          }
        }

        return null
      },
      birdLook() {

        this.map.birdLook()
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


</style>
