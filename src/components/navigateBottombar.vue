<template>
  <div class="main">
    <img class="quit" src="../assets/quit.png" v-on:click="exit(false)"/>
    <div class="route" v-for="router in routers" v-bind:key="router.id"><span v-on:click="clickFloor(router.id)" v-bind:class="getSelected(router.id)">{{ router.name }}</span><img src="../assets/jiantou.png"/></div>
    <span>终</span>
  </div>
</template>

<script>

  export default {
    name : 'navigatebottombar',
    props:['routers', 'initfloorid'],
    data:function () {
      return {
        selectedfloorId:null
      }
    },
    methods: {
      exit:function() {
        this.$emit('onexit', true)
      },
      clickFloor:function(floorId) {
        this.selectedfloorId = floorId
        this.$emit('showfloor', floorId)
      },
      getSelected:function (floorId) {

        if (this.selectedfloorId === null && floorId === this.initfloorid) {

          return 'selected'
        }

        if (this.selectedfloorId === floorId) {

          return 'selected'
        }

        return ''
      }
    }
  }

</script>

<style scoped>

  .main {
    width: 100%;
    height: 2rem;
    padding: 0.8rem 0;
    position: absolute;
    bottom: 0px;
    left: 0;
    background-color: #18202a;
    text-align: center;
  }

  .route {

    display: inline-block;
  }

  span {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    margin:0 5px;
    font-size: 0.8rem;
    line-height: 2rem;
    color: white;
    /*background-color: white;*/
    border-radius: 50%;
    border: 1px solid white;
  }

  .selected {

    background-color: white;
    color: #18202a;
  }

  .quit {
    width: 1.2rem;
    height: 1.2rem;
    left: 1rem;
    top:0;
    bottom: 0;
    margin: auto;
    position: absolute;
    background: url("../assets/quit.png") no-repeat;
    background-size: contain;
  }

  img {
    display: inline-block;
    line-height: 1.5rem;
    width: 50px;
  }

</style>
