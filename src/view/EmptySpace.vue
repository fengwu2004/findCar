<template>
  <div>
    <div id="map" class="page"></div>
    <zoom v-bind:map="map"></zoom>
    <empty-space-list></empty-space-list>
    <!--<floor-list-control :floorlist="floorList" :currentName="currentFloorName" :selectfloorid="currentFloorId" :locatefloorid="locateFloorId" v-on:onselect="onSelect"></floor-list-control>-->
  </div>
</template>


<script>

  // import '@/yfmap.min'
  import { idrMapView , networkInstance, idrMapEventTypes } from '../../../indoorunMap/map'
  import FloorListControl from '@/components/FloorListControl.vue'
  import { mapGetters } from 'vuex'
  import Zoom from "@/components/Zoom";
  import EmptySpaceList from "@/components/EmptySpaceList";

  export default {
    name: "EmptySpace",
    components: {
      EmptySpaceList,
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

      this.regionId = this.$route.params.regionId || '15313792400143094',

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
      onUnitClick(unit) {

        if (unit.fakeName == undefined) {

          return
        }

        var unfind = {name:'<span style="color: #636363;">车位编号: ' + unit.name + '</span>', callback:()=> {

            Alertboxview.hide()
          }}

        var found = {name:'<span style="color: #636363;">车位类型: ' + unit.fakeName + '</span>', callback:()=> {

            Alertboxview.hide()
          }}

        const used = '<span style="color: #636363;">使用情况: </span>' + '<span style="color: #dc6e6e;">已停车位</span>'

        const unused = '<span style="color: #636363;">使用情况: </span>' + '<span style="color: #82c33b;">空车位</span>'

        var cancel = {name:unit.spaceStatus ? used : unused, callback:() => {

            Alertboxview.hide()
          }}

        Alertboxview.show('车位使用情况', null, [unfind, found, cancel])
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
    }
  }
</script>
<style scoped lang="scss">


</style>
