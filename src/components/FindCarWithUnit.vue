<template>
  <div class="main">
    <div class="bg" v-on:click="onClose"></div>
    <div class="content">
      <img class="tag" src="../assets/car.png">
      <div class="title">输入车位号找车</div>
      <div class="tip">请输入您的车辆所停位置的车位号</div>
      <div class="floors">
        <div v-for="floor in floorlist" v-bind:key="floor.id" class="floor" v-bind:class="getFloorStyle(floor.id)" v-on:click="onSelectFloor(floor.id)">{{ floor.name }}</div>
      </div>
      <input v-model="unitName" v-on:focus="onFocuse" placeholder="例：026">
      <div class="myerrortip" v-bind:style="{visibility:showerror}">输入有误，请重新输入您的车位号!</div>
      <div class="confirmBtn" v-on:click="onConfirm">确定</div>
      <div class="line">
        <div></div><span>or</span><div></div>
      </div>
      <div class="cancelBtn" v-on:click="onCancel()">地图标记</div>
      <br>
    </div>
  </div>
</template>

<script>

  export default {
    name:'FindCarWithUnit',
    props:['map'],
    data:function() {
      return {
        findError: false,
        unitName:'',
        floorlist:this.map.regionEx.floorList,
        selectedFloorId:this.map.getFloorId()
      }
    },
    mounted() {

      this.floorlist = this.map.regionEx.floorList
    },
    methods:{
      onClose() {

        this.$store.dispatch('finishSearchCarByUnit').catch(e=>console.log(e))
      },
      onCancel() {

        this.$store.dispatch('finishSearchCarByUnit')
          .then(()=>{

            return this.$store.dispatch('startMarkInMap')
          })
          .then(()=>{

            HeaderTip.show('点击车位进行标记')
          })
          .catch(e=>console.log(e))
      },
      onConfirm() {

        var units = this.map.findUnitWithNameAndFloor(this.unitName, this.selectedFloorId)

        if (!units) {

          this.findError = true
        }
        else {

          this.onClose()

          this.$emit('onfindunits', units)
        }
      },
      onSelectFloor(floorId) {

        this.selectedFloorId = floorId

        this.map.autoChangeFloor = false

        this.map.changeFloor(floorId)
      },
      getFloorStyle(floorId) {

        if (floorId === this.selectedFloorId) {

          return 'floor floorSelected'
        }
        else {

          return 'floor'
        }
      },
      onFocuse() {

        this.findError = false
      }
    },
    computed:{
      showerror:function() {

        if (this.findError) {

          return 'visible'
        }
        else {

          return 'hidden'
        }
      }
    }
  }
</script>

<style scoped lang="scss">

  input {

    border: 1px solid #9D9D9D;
    display: block;
    width: 84%;
    margin: 1rem auto;
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

  .floors {

    text-align: center;
  }

  .floor {

    margin: 5px 10px;
    border: 1px solid #9D9D9D;
    border-radius: 5px;
    line-height: 3rem;
    font-size: 1.4rem;
    font-weight: 300;
    width: 3rem;
    height: 3rem;
    display: inline-block;
  }

  .floorSelected {

    background-color: #0086ff;
    color: white;
    border: 1px solid #0086ff;
  }

  .floor:enabled {

    color: red;
  }

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

  .myerrortip {

    margin-left: 2.5rem;
    width: 80%;
    color: red;
    font-size: 1.2rem;
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
