<template>
  <div class="main">
    <div class="bg" v-on:click="onClose"></div>
    <div class="content">
      <div class="closeBtn" v-on:click="onClose()"></div>
      <img class="tag" src="../assets/car.png">
      <p class="title">车牌找车</p>
      <p class="tip">请输入您的车牌号</p>
      <div class="inputandresults">
        <input placeholder="例：粤B NB001" v-model="carnumber" v-on:focus="onFocuse"/>
      </div>
      <p v-bind:class="getErrorShow">该车辆不在此停车场，请确认车牌号!</p>
      <div class="confirmBtn" v-on:click="onConfirm()">确定</div>
      <h5><span>  or  </span></h5>
      <div class="cancelBtn" v-on:click="onCancel()">输入车位号找车</div>
      <br>
    </div>
  </div>
</template>

<script>

  function onClose() {

    this.$emit('onclose', '0')
  }

  function onFindbyUnit() {

    this.onClose()

    this.$emit('onclose', 1)
  }

  export default {
    name:'findwithnum',
    props:['map', 'showerror', 'placeinfos'],
    data: function () {
      return {
        carnumber:"",
        onfocuse:false
      }
    },
    methods: {
      onClose:onClose,
      onConfirm:function() {

        this.onfocuse = false
        this.$emit('findbycarno', this.carnumber)
      },
      onCancel:onFindbyUnit,
      onFocuse:function () {
        this.onfocuse = true
      }
    },
    computed:{
      getErrorShow:function () {

        if (this.onfocuse) {

          return 'errorTipHide'
        }

        if (this.showerror) {

          return 'errorTip'
        }

        return 'errorTipHide'
      }
    }
}

</script>

<style scoped>

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
    width: 84%;
    background-color: #0086ff;
    color: white;
    text-align: center;
    margin: 10px auto;
    line-height: 2rem;
    border-radius: 3px;
    border: 2px solid #0086ff;
    padding: 0px 0px;
  }

  .cancelBtn {
    width: 84%;
    background-color: white;
    color: #0086ff;
    text-align: center;
    margin: 10px auto 10px;
    line-height: 2rem;
    border-radius: 3px;
    border: 1px solid #0086ff;
    padding: 1px 0px;
  }

  .inputandresults {

    width: 84%;
    height: 2rem;
    padding: 1px 0px;
    margin: 10px auto 5px;
  }

  input {
    border: 1px solid #9D9D9D;
    display: block;
    width: 100%;
    margin: 0;
    line-height: 2rem;
    border-radius: 3px;
    font-size: 1rem;
    padding: 1px 0px;
    font-weight: 100;
    text-align: center;
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

</style>
