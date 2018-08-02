<template>
  <div class="main">
    <div class="bg" v-on:click="onClose"></div>
    <div class="content">
      <img class="tag" src="../assets/car.png">
      <div class="title">车牌找车</div>
      <div class="tip">请输入您的车牌号</div>
      <div class="inputandresults">
        <input placeholder="例：粤B NB001" v-model="carnumber" v-on:focus="onFocuse"/>
        <div v-for="(car) in carlist" v-bind:key="car.carNo" class="droplist" v-on:click="onSelect(car)">
          <label class="carNo">{{ car.carNo }}</label>
          <label class="placeCode">{{ car.placeCode }}</label>
        </div>
      </div>
      <div v-bind:class="getErrorShow">该车辆不在此停车场，请确认车牌号!</div>
      <div class="confirmBtn" v-on:click="onFindByCarNo">确定</div>
      <div class="line">
        <div></div><span>or</span><div></div>
      </div>
      <div class="cancelBtn" v-on:click="onChangeToSearchUnit">输入车位号找车</div>
      <br>
    </div>
  </div>
</template>

<script>

  import { networkInstance } from "../../../indoorunMap/map";
  import { Indicator } from 'mint-ui';

  export default {
    name:'FindCarWithPlateNumber',
    props:['initcarno'],
    data() {
      return {
        carnumber:"",
        onfocuse:false,
        error:false,
        carlist:[]
      }
    },
    mounted:function () {

      if (this.initcarno != null) {

        this.carnumber = this.initcarno
      }
    },
    methods: {
      onFindByCarNo(carNo) {

        Indicator.open()

        networkInstance.getParkingPlaceUnitByCarNo(carNo)
          .then(({data})=>{

            const { matchedCarList } = data

            if (!matchedCarList) {

              return Promise.reject(null)
            }

            if (matchedCarList.length == 1) {

              this.$emit('navigatetocar', matchedCarList)

              this.onClose()
            }
            else {

              this.carlist = matchedCarList
            }
          })
          .catch(e=>{

            this.error = true

            console.log(e)
          })
          .finally(()=>{

            Indicator.close()
          })
      },
      onClose() {

        this.$store.dispatch('finishSearchCarByPlateNumber')
          .catch(e=>console.log(e))
      },
      onSelect(car) {

        this.$emit('navigatetocar', car)

        this.onClose()
      },
      onChangeToSearchUnit() {

        this.$store.dispatch('finishSearchCarByPlateNumber')
          .then(()=>{

            return this.$store.dispatch('startSearchCarByUnit')
          })
          .catch(e=>console.log(e))
      },
      onFocuse() {

        this.onfocuse = true
      }
    },
    computed:{
      getErrorShow() {

        if (this.onfocuse) {

          return 'errorTipHide'
        }

        if (this.error) {

          return 'errorTip'
        }

        return 'errorTipHide'
      }
    }
  }

</script>

<style scoped lang="scss">

  .main {
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin:0;
  }

  .bg {
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin: 0;
    background-color: black;
    opacity: 0.4;
    /*z-index: 1000;*/
  }

  .content {
    border-radius: 0.9rem;
    background-color: white;
    position: absolute;
    width: 80%;
    top: 15%;
    left: 0;
    right: 0;
    margin: auto;
    /*z-index: 1001;*/
  }

  .tag {

    position: absolute;
    left: 0;
    right: 0;
    top: -4.5rem;
    display: block;
    margin: auto;
    width: 9rem;
    height: 9rem;
  }

  .title {

    text-align: center;
    font-size: 2.1rem;
    font-weight: 400;
    padding: 5.5rem 0 0 0;
  }

  .tip {

    text-align: center;
    color: #9D9D9D;
    font-weight: 200;
    margin-top: 1rem;
    font-size: 1.4rem;
  }

  .errorTip {

    width: 80%;
    color: red;
    font-size: 1.2rem;
    margin: auto;
    margin-top: 1rem;
  }

  .errorTipHide {

    visibility: hidden;
    width: 80%;
    color: red;
    font-size: 0.5rem;
    margin: auto;
  }

  .confirmBtn {

    width: 84%;
    background-color:#3984DD;
    color: white;
    text-align: center;
    margin: 25px auto;
    line-height: 4rem;
    border-radius: 50px;
    border: 2px solid #3984DD;
    padding: 0px 0px;
    font-size: 1.4rem;
  }

  .cancelBtn {

    width: 84%;
    background-color: white;
    color: #3984DD;
    text-align: center;
    margin: 25px auto 10px;
    line-height: 4rem;
    border-radius: 50px;
    border: 1px solid #3984DD;
    padding: 1px 0px;
    font-size: 1.4rem;
  }

  .inputandresults {

    width: 84%;
    height: 4rem;
    padding: 1px 0px;
    margin: 25px auto 5px;
    overflow-y: visible;
    z-index: 1003;
    position: relative;
  }

  input {

    border: 1px solid #9D9D9D;
    display: block;
    width: 100%;
    margin: 0;
    border-radius: 3px;
    line-height: 4rem;
    font-size: 1.2rem;
    padding: 1px 0px;
    font-weight: 100;
    user-select: text !important;
    -webkit-user-select: text !important;
    text-align: center;
  }

  input::placeholder {

    color: #636363;
    font-size: 1.2rem;
  }

  .droplist {

    background-color: white;
    border-bottom: 1px solid #9D9D9D;
    border-right: 1px solid #9D9D9D;
    border-left: 1px solid #9D9D9D;
    height: 2rem;
    width: 100%;
  }

  .carNo {

    line-height: 2rem;
    font-size: 0.8rem;
    margin-left: 1rem;
  }

  .placeCode {

    line-height: 2rem;
    font-size: 0.8rem;
    position: absolute;
    right: 1rem;
  }

  .line {

    margin: 1rem auto;
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .line > div {

    width: 40%;
    height: 1px;
    background: lightgray;
  }

  .line > span {

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    padding: 0 0.5rem;
    color: lightgray;
  }
</style>
