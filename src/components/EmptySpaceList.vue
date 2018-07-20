<template>
  <div class="main">
    <div v-if="!isUp" class="up" @click="isUp = !isUp"></div>
    <div v-else class="down" @click="isUp = !isUp"></div>
    <div class="listheader" @click="isUp = !isUp">
      <div>车位类型</div>
      <div>车位总数</div>
      <div>已停车位数</div>
      <div>空车位数</div>
    </div>
    <div class="list">
      <empty-space-list-cell :data="parkingdetail"></empty-space-list-cell>
      <empty-space-list-cell v-if="!isUp" v-for="(spaceground, index) in parkingdetail.spaceOverviewList" :data="spaceground" v-bind:key="index"></empty-space-list-cell>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
	import EmptySpaceListCell from "@/components/EmptySpaceListCell";

  export default {
		name: "EmptySpaceList",
    components: {EmptySpaceListCell},
    data(){
		  return {
		    isUp:false,
      }
    },
    computed: {
      ...mapGetters([
        'parkingdetail'
      ])
    },
	}
</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .up, .down {

    width: 6rem;
    height: 0.8rem;

  }

  .up {

    background: url("../assets/up.png") no-repeat center/100%;
  }

  .down {

    background: url("../assets/down.png") no-repeat center/100%;
  }

  .listheader {

    background-color: #FAFAFA;
    align-items: center;
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: center;
    font-size: 0.6rem;
    color: #C8C8C8;

    > div {

      flex: 1;
    }

    > div:first-child {

      padding-left: 1rem;
    }
  }

  .list {

    width: 100%;
  }

</style>
