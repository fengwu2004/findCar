<template>
  <div class="main">
    <div class="bg" v-on:click="onClose"></div>
    <div class="content">
      <div class="closeBtn" v-on:click="onClose"></div>
      <img class="tag" src="../assets/car.png">
      <p class="title">车牌找车</p>
      <p class="tip">请输入您的车牌号</p>
      <div class="inputandresults">
        <input placeholder="例：粤B NB001" v-model="carnumber" v-on:focus="onFocuse"/>
        <div v-for="(car) in carlist" v-bind:key="car.carNo" class="droplist" v-on:click="onSelect(car)">
          <label class="carNo">{{ car.carNo }}</label>
          <label class="placeCode">{{ car.placeCode }}</label>
        </div>
      </div>
      <p v-bind:class="getErrorShow">该车辆不在此停车场，请确认车牌号!</p>
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
      getErrorShow:function () {

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
    z-index: 1000;
  }

  .content {
    border-radius: 5px;
    background-color: white;
    position: absolute;
    width: 80%;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1001;
  }

  .closeBtn {

    position: absolute;
    right:20px;
    top:20px;
    width: 10px;
    height: 10px;
    background: url("../assets/close1.png") no-repeat center /1rem 1rem;
  }

  .tag {
    display: block;
    left: 0;
    right: 0;
    margin: -3.5rem auto;
    width: 7rem;
    height: 7rem;
  }

  .title {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 400;
    margin: 0;
    padding: 3.5rem 0 10px 0;
  }

  .tip {
    text-align: center;
    margin: 0 auto;
    padding-bottom: 10px;
    color: #9D9D9D;
    font-weight: 200;
    font-size: 0.875rem;
  }

  .errorTip {
    width: 80%;
    color: red;
    font-size: 0.5rem;
    margin: auto;
  }

  .errorTipHide {

    visibility: hidden;
    width: 80%;
    color: red;
    font-size: 0.5rem;
    margin: auto;
  }

  .confirmBtn {

    width: 70%;
    background-color:#3984DD;
    color: white;
    text-align: center;
    margin: 10px auto;
    line-height: 2rem;
    border-radius: 20px;
    border: 2px solid #3984DD;
    padding: 0px 0px;
    font-size: 0.7rem;
  }

  .cancelBtn {

    width: 70%;
    background-color: white;
    color: #3984DD;
    text-align: center;
    margin: 10px auto 10px;
    line-height: 2rem;
    border-radius: 20px;
    border: 1px solid #3984DD;
    padding: 1px 0px;
    font-size: 0.7rem;
  }

  .inputandresults {

    width: 84%;
    height: 2rem;
    padding: 1px 0px;
    margin: 10px auto 5px;
    overflow-y: visible;
    z-index: 1003;
    position: relative;
  }

  input {

    border: 1px solid #9D9D9D;
    display: block;
    width: 100%;
    margin: 0;
    line-height: 2rem;
    /*border-radius: 3px;*/
    font-size: 1rem;
    padding: 1px 0px;
    font-weight: 100;
    user-select: text !important;
    -webkit-user-select: text !important;
    text-align: center;
  }

  input::placeholder {

    color: #636363;
    font-size: 0.6rem;
  }

  span {
    line-height: 0.5rem;
    font-weight: 100;
  }

  h5 {
    width: 80%;
    margin: auto;
    color: lightgray;
  }

  h5 span:before, h5 span:after {

    display: inline-block;
    content: '';
    vertical-align: bottom;
    height: .4rem;
    line-height: 0.5rem;
    border-top:1px solid lightgray;
    width: 45%;
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
    font-size: 0.6rem;
    padding: 0 0.5rem;
    color: lightgray;
  }
</style>
