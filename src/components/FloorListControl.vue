<template>
  <div class="main">
    <div class="showAllFloor" @click="showAllFloor"></div>
    <div class="fadein">
      <div v-for="floor in floorList" v-bind:key="floor.floorIndex" v-bind:class="getFloorStyle(floor.floorIndex)" v-on:click="onSelect(floor.floorIndex)">{{ floor.name }}</div>
    </div>
  </div>
</template>

<script>


  export default {
    name :'floorlistdiv',
    props:['floorList', 'selectedIndex', 'locatedIndex'],
    data:function() {
      return {
        show:false,
        dropDownStyle:'fadeout'
      }
    },
    computed:{

    },
    methods:{
      showAllFloor() {

        this.$emit("show-all-floor")
      },
      onShow() {

        this.show = !this.show

        if (this.show) {

          this.dropDownStyle = 'fadein'
        }
        else {

          this.dropDownStyle = 'fadeout'
        }
      },
      onSelect(floorIndex) {

        this.$emit('on-select', floorIndex)

        this.show = false

        if (this.show) {

          this.dropDownStyle = 'fadein'
        }
        else {

          this.dropDownStyle = 'fadeout'
        }
      },
      getFloorStyle(floorIndex) {

        if (floorIndex === this.selectedIndex) {

          return 'dropdown selected'
        }
        else {

          return 'dropdown'
        }
      },
      name() {

        for (var i = 0; i < this.floorList.length; ++i) {

          if (this.floorList[i].floorIndex === this.selectedIndex) {

            return this.floorList[i].name
          }
        }

        return null
      },
      checkShow(floorIndex) {

        return this.locatedIndex == floorIndex
      }
    }
  }

</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    left: 1.1rem;
    top: 9rem;
  }

  .fadein {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.5s linear;
    max-height: 16rem;
    overflow-y: scroll;
  }

  .fadeout {

    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.5s, opacity 0.5s linear;
    max-height: 18rem;
    overflow-y: scroll;
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

  .showAllFloor {

    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 1rem;

    background: url("../assets/showallfloor.png") no-repeat center/100%;
  }

</style>
