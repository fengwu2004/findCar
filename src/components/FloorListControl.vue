<template>
  <div v-bind:class="[innavi ? naviposition:normalposition]">
    <div class="allFloor" v-if="floorList.length > 1" @click="showAllFloor">
      <img v-if="!showallfloor" src="../assets/allfloor.png"/>
      <img v-else src="../assets/allfloor_selected.png"/>
    </div>
    <div class="start"><span><</span></div>
    <div class="floors">
      <!--<div class="coverselected"></div>-->
      <mt-picker :slots="slots" @change="onValuesChange" :visibleItemCount="5" :item-height="40"></mt-picker>
    </div>
    <div class="end"><span><</span></div>
  </div>
</template>

<script>

  import { idrCoreMgr } from "../../../indoorunMap/map";

  export default {
    name :'floorlistdiv',
    props:['floorList', 'selectedFloorname', 'locatedIndex', 'showallfloor', 'innavi', 'firstload'],
    methods:{
      showAllFloor() {

        if (this.selectedIndex == -1) {

          this.$emit("show-all-floor", false)
        }
        else {

          this.$emit("show-all-floor", true)
        }
      },
      onSelect(floorIndex) {

        this.$emit('on-select', floorIndex)
      },
      onValuesChange(picker, values) {

        if (this.firstload) {

          return
        }

        let floorIndex = -1

        for (let i = 0; i < this.floorList.length; ++i) {

          if (values[0] == this.floorList[i].name) {

            floorIndex = this.floorList[i].floorIndex

            break
          }
        }

        console.log('xxx', floorIndex)

        if (floorIndex != -1) {

          this.onSelect(floorIndex)
        }
      }
    },
    watch:{

      selectedFloorname(newValue) {

        for (let i = 0; i < this.slots[0].values.length; ++i) {

          if (newValue == this.slots[0].values[i]) {

            this.slots[0].defaultIndex = i

            return
          }
        }
      }
    },
    mounted(){

      for (let i = this.floorList.length - 1; i >= 0; --i) {

        this.slots[0].values.push(this.floorList[i].name)
      }

      for (let i = 0; i < this.slots[0].values.length; ++i) {

        if (this.selectedFloorname == this.slots[0].values[i]) {

          this.slots[0].defaultIndex = i

          console.log('mounted', i)

          return
        }
      }
    },
    data(){
      return {
        main:'main',
        othermain:'othermain',
        slots:[{
          flex: 1,
          values: [],
          className: 'floors',
          textAlign: 'center',
          defaultIndex:0
        }]
      }
    },
    computed:{
      naviposition() {

        if (idrCoreMgr.isAndroid) {

          return 'androidnavigate'
        }
        else {

          return 'iosnavigate'
        }
      },
      normalposition() {

        if (idrCoreMgr.isAndroid) {

          return 'androidnormal'
        }
        else {

          if (document.body.clientHeight == 812) {

            return 'iosbignormal'
          }
          else {

            return 'iosnormal'
          }
        }
      }
    }
  }

</script>

<style scoped lang="scss">

  $btnwidth:4rem;

  .androidnavigate {

    position: absolute;
    left: 2rem;
    top: 13.8rem;
  }

  .androidnormal {

    position: absolute;
    left: 2rem;
    top: 2.1rem;
  }

  .iosnormal {

    position: absolute;
    left: 2rem;
    top: 8.4rem;
  }

  .iosbignormal {

    position: absolute;
    left: 2rem;
    top: 10.8rem;
  }

  .coverselected {

    position: absolute;
    //background: url("../assets/selectedFloor.png") no-repeat center/112%;
    width: 100%;
    background-color: red;
    height: 4rem;
    top: 12rem;
  }

  .iosnavigate {

    position: absolute;
    left: 2rem;
    top: 14rem;
  }

  .floors {

    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    justify-content: flex-start;
    background-color: white;
  }

  .start {

    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: gray;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;

    > span {

      transform: rotate(90deg);
      font-size: 1rem;
    }
  }

  .end {

    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: gray;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;

    > span {

      transform: rotate(-90deg);
      font-size: 1rem;
    }
  }

  .floors::-webkit-scrollbar {display:none}

  .floor {

    background-size: $btnwidth;
    background: white;
    color: #2B3547;
    width: $btnwidth;
    height: $btnwidth;
    font-size: 1.6rem;

    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .selected {

    background: url("../assets/selectedFloor.png") no-repeat center/112%;
    font-size: 1.6rem;
  }

  .allFloor {

    width: $btnwidth;
    height: $btnwidth;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px 0 rgba(0,0,0,0.12);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;

    > img {

      width: 80%;
    }
  }


</style>
