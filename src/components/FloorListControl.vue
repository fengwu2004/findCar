<template>
  <div class="main">
    <div class="allFloor" v-if="floorList.length > 1" @click="showAllFloor">
      <img v-if="!showallfloor" src="../assets/allfloor.png"/>
      <img v-else src="../assets/allfloor_selected.png"/>
    </div>
    <div class="floors">
      <div v-for="floor in floorList" v-bind:key="floor.floorIndex" v-bind:class="[floor.floorIndex == selectedIndex ? 'selected' : '', 'floor']" v-on:click="onSelect(floor.floorIndex)">{{ floor.name }}</div>
    </div>
  </div>
</template>

<script>


  export default {
    name :'floorlistdiv',
    props:['floorList', 'selectedIndex', 'locatedIndex', 'showallfloor'],
    methods:{
      showAllFloor() {

        this.$emit("show-all-floor")
      },
      onSelect(floorIndex) {

        this.$emit('on-select', floorIndex)
      }
    }
  }

</script>

<style scoped lang="scss">

  $btnwidth:3rem;

  .main {

    position: absolute;
    left: 2rem;
    top: 10rem;
  }

  .floors {

    display: flex;
    flex-direction: column;
    height: 15rem;
    overflow-y: scroll;
    justify-content: flex-start;



    > div:first-child {

      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    > div:last-child {

      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    border-radius: 0.5rem;
  }

  .floors::-webkit-scrollbar {display:none}

  .floor {

    background-size: $btnwidth;
    background: white;
    color: #2B3547;
    width: $btnwidth;
    height: $btnwidth;
    font-size: 0.9rem;

    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .selected {

    background: url("../assets/selectedFloor.png") no-repeat center/112%;
    font-size: 0.9rem;
  }

  .allFloor {

    width: $btnwidth;
    height: $btnwidth;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px 0;
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
