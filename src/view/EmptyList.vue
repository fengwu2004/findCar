<template>
  <div>
    <parking-cell v-for="parking in parkingList" v-bind:key="parking.parkCode" :data="parking"></parking-cell>
  </div>
</template>


<script>

  import { networkInstance } from '../../../indoorunMap/map'
  import ParkingCell from "@/components/ParkingCell";

  export default {
    name: "EmptyList",
    components: {ParkingCell},
    data() {
      return {
        parkingList:[]
      }
    },
    mounted() {
      networkInstance.parksOverview()
        .then(res=>{

          if (res.code != 'success') {

            return Promise.reject(res.msg)
          }

          this.parkingList = res.data
        })
        .catch((msg)=>{

          window.HeaderTip.show(msg)
        })
    }
  }
</script>
<style scoped lang="scss">


</style>
