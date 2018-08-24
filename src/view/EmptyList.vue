<template>
  <div class="main">
    <div v-if="finishAjax" class="paopao chanye1_paopao">
      <span>空车位:{{regionList[2].emptyCount}}</span>
      <span>充电桩:{{regionList[2].chargeStick}}</span>
    </div>
    <div v-if="finishAjax" class="paopao chanye2_paopao">
      <span>空车位:{{regionList[3].emptyCount}}</span>
      <span>充电桩:{{regionList[3].chargeStick}}</span>
    </div>
    <div v-if="finishAjax" class="paopao jiudian_paopao">
      <span>空车位:{{regionList[0].emptyCount}}</span>
      <span>充电桩:{{regionList[0].chargeStick}}</span>
    </div>
    <div v-if="finishAjax" class="paopao zhanting_paopao">
      <span>空车位:{{regionList[1].emptyCount}}</span>
      <span>充电桩:{{regionList[1].chargeStick}}</span>
    </div>
    <div class="chanye1 btn" @click="enterRegion(2)">产业一停车场</div>
    <div class="chanye2 btn" @click="enterRegion(3)">产业二停车场</div>
    <div class="jiudian btn" @click="enterRegion(0)">酒店停车场</div>
    <div class="zhanting btn" @click="enterRegion(1)">展厅停车场</div>
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
        finishAjax:false,
        regionList:[
          {name:'潼湖科技小镇_商业停车场', regionId:'15313792400143094', floorId:'15313804821833137'},
          {name:'潼湖科技小镇_展厅停车场', regionId:'14559560656150195', floorId:'15323294861499896'},
          {name:'潼湖科技小镇_产业1停车场', regionId:'14533784131830010', floorId:'15323294173829181'},
          {name:'潼湖科技小镇_产业2停车场', regionId:'14504321009170013', floorId:'15323290763798360'}],
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
      updateParkingInfo({regionId, emptyCount, chargeStick}) {

        for (let i = 0; i < this.regionList.length; ++i) {

          if (regionId == this.regionList[i].regionId) {

            this.regionList[i].emptyCount = emptyCount

            this.regionList[i].chargeStick = 0
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

  .btn {

    background: #3C961E;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
    border-radius: 4.5px;
    font-size: 1.4rem;
    color: #fff;
    width: 11rem;
    height: 3rem;
    text-align: center;
    line-height: 3rem;
  }

  .chanye1 {

    position: absolute;
    left: 7%;
    top: 33%;
  }

  .chanye1_paopao {

    position: absolute;
    left: 12%;
    top: 27%;
  }

  .chanye2 {

    position: absolute;
    left: 40%;
    top: 42%;
  }

  .chanye2_paopao {

    position: absolute;
    left: 45%;
    top: 36%;
  }

  .jiudian {

    position: absolute;
    right: 5%;
    top: 30%;
  }

  .jiudian_paopao {

    position: absolute;
    right: 10%;
    top: 24%;
  }

  .zhanting {

    position: absolute;
    right: 4%;
    top: 17%;
  }

  .zhanting_paopao {

    position: absolute;
    right: 8%;
    top: 11%;
  }

  .paopao {

    width: 7.5rem;
    height: 3.2rem;
    background: url("../assets/paopao.png") no-repeat center/100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {

      color: white;
      font-size: 0.8rem;
    }
  }

</style>
