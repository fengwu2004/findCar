<template>
  <div class="main">
    <div class="currentName" v-on:click="onShow()">{{ currentName }}<span v-show="checkShow(selectfloorid)" class="lc_dot">●</span></div>
    <div v-bind:class="dropDownStyle">
      <div v-for="floor in floorlist" v-bind:key="floor.id" :class="getFloorStyle(floor.id)" @click="onSelect(floor.id)">{{ floor.name }}<span v-show="checkShow(floor.id)" class="lc_dot">●</span></div>
    </div>
  </div>
</template>

<script>

  export default {
    name :'FloorListControl',
    props: ['floorlist', 'selectfloorid', 'locatefloorid', 'currentName'],
    data:function() {
      return {
        show:false,
        dropDownStyle:'fadeout'
      }
    },
    methods:{
      onShow() {

        this.show = !this.show

        if (this.show) {

          this.dropDownStyle = 'fadein'
        }
        else {

          this.dropDownStyle = 'fadeout'
        }
      },
      onSelect(floorId) {

        this.$emit('onselect', floorId)

        console.log('选择:' + floorId)

        this.show = false

        if (this.show) {

          this.dropDownStyle = 'fadein'
        }
        else {

          this.dropDownStyle = 'fadeout'
        }
      },
      getFloorStyle(floorId) {

        if (floorId === this.selectfloorid) {

          return 'dropdown selected'
        }
        else {

          return 'dropdown'
        }
      },
      checkShow(floorId) {

        return this.locatefloorid == floorId
      }
    }
  }

</script>

<style scoped>

  .main {

    position: absolute;
    right: 1.1rem;
    top: 9rem;
  }

  .fadein {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.5s linear;
  }

  .fadeout {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.5s, opacity 0.5s linear;
  }

  .currentName {
    background: url("../assets/楼层切换1.png") no-repeat;
    background-size: 2.5rem;
    color: #030303;
    text-align: center;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    font-size: 0.9rem;
  }

  .lc_dot{
    color: red;
    font-size: 8px;
    position: absolute;
    right: 2px;
  }

  .dropdown {

    background: url("../assets/楼层切换3.png") no-repeat;
    background-size: 2.5rem;
    color: white;
    text-align: center;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    margin: 5px 0;
    text-align: center;
    font-size: 0.9rem;
  }

  .selected{
    background: url("../assets/楼层切换2.png") no-repeat;
    background-size: 2.5rem;
    color: #fff;
    line-height: 2.5rem;
    text-align: center;
    color: white;
    font-size: 0.9rem;
  }

  .lc_div{
    position: absolute;
    right:1.1rem;
    top:15%;
    border-radius: 5px;
    width: 2.2rem;
    height: 2.3rem;
    z-index: 12;
  }

  .lc_divcom {
    width: 100%;
    height: 2.3rem;
    line-height: 2.1rem;
    font-size: 16px;
  }

</style>
