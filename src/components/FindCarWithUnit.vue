<template>
  <div class="main">
    <div class="bg" v-on:click="onClose"></div>
    <div class="content">
      <div class="closeBtn" v-on:click="onClose"></div>
      <img class="tag" src="../assets/car.png">
      <p class="title">输入车位号找车</p>
      <p class="tip">请输入您的车辆所停位置的车位号</p>
      <div class="floors">
        <div v-for="floor in floorlist" v-bind:key="floor.id" class="floor" v-bind:class="getFloorStyle(floor.id)" v-on:click="onSelectFloor(floor.id)">{{ floor.name }}</div>
      </div>
      <input v-model="unitName" v-on:focus="onFocuse" placeholder="例：026">
      <p class="errortip" v-bind:style="{visibility:showerror}">输入有误，请重新输入您的车位号!</p>
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

            Toast.show('点击车位进行标记')
          })
          .catch(e=>console.log(e))
      },
      onConfirm() {

        var units = this.map.findUnitWithName(this.selectedFloorId, this.unitName)

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

  .main {
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin:0;
  }

  .bg {
    background-color: black;
    left: 0;
    top: 0;
    right: 0;
    bottom:0;
    position: absolute;
    margin: 0;
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

  .errortip {

    width: 80%;
    color: red;
    font-size: 0.5rem;
    margin: auto;
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
    font-size: 0.7rem;
  }

  input {

    border: 1px solid #9D9D9D;
    display: block;
    width: 80%;
    margin: 10px auto 5px;
    line-height: 2rem;
    border-radius: 3px;
    font-size: 1rem;
    padding: 1px 10px;
    font-weight: 100;
    text-align: center;
    user-select: text;
    -webkit-user-select:text;
  }

  input::placeholder {

    color: #636363;
    font-size: 0.6rem;
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

  .floors {

    text-align: center;
  }

  .floor {

    margin: 5px 10px;
    border: 1px solid #9D9D9D;
    border-radius: 2px;
    line-height: 1.6rem;
    font-size: 0.6rem;
    font-weight: 300;
    width: 1.6rem;
    height: 1.6rem;
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
</style>
