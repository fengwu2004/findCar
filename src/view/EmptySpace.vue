<template>
  <div>
    <div id="map" class="page"></div>
    <floor-list-control :floorlist="floorList" :currentName="currentFloorName" :selectfloorid="currentFloorId" :locatefloorid="locateFloorId" v-on:onselect="onSelect"></floor-list-control>
    <zoom v-bind:map="map"></zoom>
  </div>
</template>


<script>

  import { idrMapView , networkInstance, idrMapEventTypes } from '../../../indoorunMap/map'
  import FloorListControl from '@/components/FloorListControl.vue'
  import navigation from '@/components/navigation.vue'
  import { mapGetters } from 'vuex'
  import Zoom from "@/components/Zoom";

  window.debugtest = true

  export default {
    name: "EmptySpace",
    components: {
      Zoom,
      FloorListControl,
      },
    data() {
      return {
        floorList:[],
        currentFloorName:'',
        currentFloorId:null,
        locateFloorId:null,
        regionEx:null,
        map:null,
        regionId:'15313792400143094',
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
    },
    methods:{
      onSelect(val) {

        this.currentFloorId = val

        this.map.changeFloor(val)

        this.map.autoChangeFloor = false
      },
      onUnitClick(unit) {

        if (!this.mapState.markInMap) {

          return
        }

        this.$store.dispatch('finishMarkInMap')
          .then(()=>{

            this.map.doRoute(null, unit.position)
          })
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

        this.currentFloorId = floorId

        this.currentFloorName = this.getCurrentName()

        networkInstance.parksOverview(this.regionId)
          .then(res=>{

            return this.$store.dispatch('setParkingDetail', res.data[0])
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
    }
  }
</script>
<style scoped lang="scss">

  @import "app.css";
  @import "indoorun.css";

</style>
