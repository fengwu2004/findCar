<template>
  <div v-bind:class="[innavi ? main:othermain]">
    <div class="allFloor" v-if="floorList.length > 1" @click="showAllFloor">
      <img v-if="!showallfloor" src="../assets/allfloor.png"/>
      <img v-else src="../assets/allfloor_selected.png"/>
    </div>
    <div class="start"><span><</span></div>
    <div class="floors">
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </div>
    <div class="end"><span><</span></div>
  </div>
</template>

<script>
  export default {
    name :'floorlistdiv',
    props:['floorList', 'selectedIndex', 'locatedIndex', 'showallfloor', 'innavi', 'firstload'],
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

            floorIndex = i

            break
          }
        }

        if (floorIndex != -1) {

          this.onSelect(floorIndex)
        }
      }
    },
    watch:{

      selectedIndex(newValue) {

        console.log(newValue)

        this.slots[0].defaultIndex = newValue
      }
    },
    mounted(){

      for (let i = 0; i < this.floorList.length; ++i) {

        this.slots[0].values.push(this.floorList[i].name)
      }

      this.slots[0].defaultIndex = this.selectedIndex
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
    }
  }

</script>

<style scoped lang="scss">

  $btnwidth:4rem;

  .othermain {

    position: absolute;
    left: 1rem;
    top: 3rem;
  }

  .main {

    position: absolute;
    left: 1rem;
    top: 12.7rem;
  }

  .floors {

    display: flex;
    flex-direction: column;
    height: 15rem;
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
    margin-bottom: 2rem;
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
