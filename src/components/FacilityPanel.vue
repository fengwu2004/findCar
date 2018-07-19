<template>
  <div class="main">
    <div class="bg" v-on:click="onClose"></div>
    <div class="content">
      <img class="tag" src="../assets/public_img.png">
      <div class="closeBtn" v-on:click="onClose"></div>
      <p class="title">公共设施</p>
      <p class="tip">智能搜索 一键导航 规划最短路线</p>
      <h5><span>  搜一下  </span></h5>
      <div class="facilities">
        <facilitybtn class="facility" v-for="facility in facilities" v-bind:key="facility.type" v-bind:item="facility" v-on:onclickunitwith="onClickUnit"></facilitybtn>
      </div>
    </div>
  </div>
</template>

<script>


  import facilitybtn from './facilitybtn.vue'

  const futi = {
    type:1,
    title:'扶梯',
    icon:'./static/futi.png'
  }

  const dianti = {

    type:2,
    title:'电梯',
    icon:'./static/dianti.png'
  }

  const xishoujian = {
    type:3,
    title:'洗手间',
    icon:'./static/cesuo.png'
  }

  const atm = {
    type:4,
    title:'ATM',
    icon:'./static/ATM.png'
  }

  const chukou = {
    type:5,
    title:'出口',
    icon:'./static/chukou.png'
  }

  const rukou = {
    type:7,
    title:'入口',
    icon:'./static/rukou.png'
  }

  const anquanchukou = {
    type:8,
    title:'安全出口',
    icon:'./static/people.png'
  }

  const louti = {
    type:9,
    title:'楼梯',
    icon:'./static/louti.png'
  }

  const xiche = {
    type:10,
    title:'洗车',
    icon:'./static/xiche.png'
  }

  const shoufeichu = {
    type:11,
    title:'收费处',
    icon:'./static/shoufeichu.png'
  }

  function getIcons(type) {

    if (type == 1) return futi

    if (type == 2) return dianti

    if (type == 3) return xishoujian

    if (type == 4) return atm

    if (type == 5) return chukou

    if (type == 7) return rukou

    if (type == 8) return anquanchukou

    if (type == 9) return louti

    if (type == 10) return xiche

    if (type == 11) return shoufeichu
  }

  export default {
    name :'FacilityPanel',
    props:['map'],
    data(){
      return {
        facilities:[]
      }
    },
    mounted(){

      let temps = this.map.findUnitsWithType([1, 2, 3, 4, 5, 7, 8, 9, 10, 11])

      this.facilities.length = 0

      for (var key in temps) {

        this.facilities.push(getIcons(key))
      }
    },
    methods:{
      onClose() {

        this.$emit('onclose')
      },
      onClickUnit(type) {

        this.$emit('onnavigateto', type)
      }
    },
    components: { facilitybtn }
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
    left:0;
    right:0;
    width: 80%;
    top: 20%;
    margin:auto;
    z-index: 1001;
  }

  .title {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 400;
    margin: 0;
    padding: 4rem 0 10px 0;
  }

  .tip {

    text-align: center;
    margin: 0 auto;
    padding-bottom: 30px;
    color: #9D9D9D;
    font-weight: 200;
    font-size: 0.875rem;
  }

  .tag {
    display: block;
    left: 0;
    right: 0;
    margin: -3.5rem auto;
    width: 5rem;
    height: 5rem;
  }

  h5 {
    width: 70%;
    margin: auto;
    color: lightgray;
    text-align: center;
    padding-bottom: 10px;
  }

  span {
    text-align: center;
    line-height: 0.5rem;
    font-weight: 100;
  }

  h5 span:before, h5 span:after {

    display: inline-block;
    content: '';
    vertical-align: bottom;
    height: .4rem;
    line-height: 0.5rem;
    border-top:1px solid lightgray;
    width: 35%;
  }

  .closeBtn {

    position: absolute;
    right:20px;
    top:20px;
    width: 10px;
    height: 10px;
    background: url("../assets/close1.png") no-repeat center /1rem 1rem;
  }

  .facilities {

    left: 0;
    right: 0;
    margin: auto;
    width: 80%;
    display: flex;
    display: -webkit-flex;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 30px;
    flex-wrap: wrap;
  }

  .facility {

    flex:1 1 30%;
  }

</style>
