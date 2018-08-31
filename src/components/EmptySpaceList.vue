<template>
  <div class="main">
    <div v-if="!isUp" class="down" @click="isUp = !isUp"></div>
    <div v-else class="up" @click="isUp = !isUp"></div>
    <div class="listheader" @click="isUp = !isUp">
      <div>车位类型</div>
      <div>车位总数</div>
      <div>已占用车位数</div>
      <div>空车位数</div>
    </div>
    <div class="list">
      <empty-space-list-cell v-if="isUp" :data="temporary"></empty-space-list-cell>
      <empty-space-list-cell v-if="!isUp" v-for="(spaceground, index) in parkingdetail.spaceOverviewList" :data="spaceground" v-bind:key="index"></empty-space-list-cell>
      <empty-space-list-cell v-if="!isUp" :data="parkingdetail"></empty-space-list-cell>
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
		    isUp:true,
      }
    },
    computed: {
      ...mapGetters([
        'parkingdetail'
      ]),
      temporary:function () {

        for (let i = 0; i < this.parkingdetail.spaceOverviewList.length; ++i) {

          if (this.parkingdetail.spaceOverviewList[i].areaName.indexOf('临时') != -1) {

            return this.parkingdetail.spaceOverviewList[i]
          }
        }

        return null
      }
    },
	}
</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    z-index: 2;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .up, .down {

    width: 100%;
    height: 1.8rem;
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
    height: 3rem;
    display: flex;
    justify-content: center;
    font-size: 1.2rem;
    color: #C8C8C8;

    > div {

      flex: 1;
    }

    > div:first-child {

      padding-left: 1.5rem;
    }
  }

  .list {

    width: 100%;
  }

</style>
