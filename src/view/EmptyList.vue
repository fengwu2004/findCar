<template>
  <div class="main">
    <empty-paopao v-if="finishAjax" :region="regionList[2]" class="chanye1" name="产业一停车场"></empty-paopao>
    <empty-paopao v-if="finishAjax" :region="regionList[3]" class="chanye2" name="产业二停车场"></empty-paopao>
    <empty-paopao v-if="finishAjax" :region="regionList[0]" class="jiudian" name="酒店停车场"></empty-paopao>
    <empty-paopao v-if="finishAjax" :region="regionList[1]" class="zhanting" name="展厅停车场"></empty-paopao>
  </div>
</template>


<script>

  import { networkInstance } from '../../../indoorunMap/map'
  import ParkingCell from "@/components/ParkingCell";
  import EmptyPaopao from "@/components/EmptyPaopao";

  export default {
    name: "EmptyList",
    components: {EmptyPaopao, ParkingCell},
    data() {
      return {
        finishAjax:false,
        regionList:[
          {name:'酒店停车场', regionId:'15313792400143094', floorId:'15313804821833137'},
          {name:'展厅停车场', regionId:'14559560656150195', floorId:'15323294861499896'},
          {name:'产业一停车场', regionId:'14533784131830010', floorId:'15323294173829181'},
          {name:'产业二停车场', regionId:'14504321009170013', floorId:'15323290763798360'}],
      }
    },
    methods:{
      enterRegion(index) {

        if (index < 0 || index >= 4) {

          return
        }

        let region = this.regionList[index]

        this.$router.push({path:'/emptyspace', query:{regionId:region.regionId, parkCode:region.parkCode}})
      },
      updateParkingInfo({regionId, emptyCount}) {

        for (let i = 0; i < this.regionList.length; ++i) {

          if (regionId == this.regionList[i].regionId) {

            this.regionList[i].emptyCount = emptyCount
          }
        }
      }
    },
    mounted() {
      networkInstance.parksOverview()
        .then(res=>{

          if (res.code != 'success') {

            return Promise.reject(res.msg)
          }

          let parkingList = res.data

          parkingList.forEach(parking => this.updateParkingInfo(parking))

          this.finishAjax = true
        })
        .catch((msg)=>{

          this.finishAjax = true

          window.HeaderTip.show(msg)
        })
    }
  }
</script>
<style scoped lang="scss">

  .main {

    background: url("../assets/totalmap.jpg") no-repeat center/100% 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding-top: 3rem;
  }

  .chanye1 {

    position: absolute;
    left: 7%;
    top: 20%;
  }

  .chanye2 {

    position: absolute;
    left: 30%;
    top: 34%;
  }

  .jiudian {

    position: absolute;
    right: 5%;
    top: 24%;
  }

  .zhanting {

    position: absolute;
    right: 4%;
    top: 7%;
  }

</style>
