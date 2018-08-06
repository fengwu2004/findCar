<template>
  <div>
    <div class="header" @click="gotoMap">
      <span>{{data.parkName}}</span>
      <img src="../assets/ditu.png"/>
    </div>
    <div class="listheader">
      <div>车位类型</div>
      <div>车位总数</div>
      <div>已停车位数</div>
      <div>空车位数</div>
      <empty-space-list-cell v-for="(list, index) in data.spaceOverviewList" v-bind:key="index" :data="list"></empty-space-list-cell>
    </div>
  </div>
</template>

<script>
	import EmptySpaceListCell from "@/components/EmptySpaceListCell";
  export default {
		name: "ParkingCell",
    components: {EmptySpaceListCell},
    props:{
		  data:{
		    parkName:String,
        regionId:String,
        spaceOverviewList:Array
      }
    },
    methods:{
      gotoMap() {

        this.$router.push({path:'/emptyspace', query:{regionId:this.data.regionId, parkCode:this.data.parkCode}})
      }
    }
	}
</script>

<style scoped lang="scss">

  .header {

    margin-top: 1rem;
    background: #E6E6E6;
    font-size: 1.4rem;
    color: #1B1C1C;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    padding: 0 1rem;

    > img {

      width: 2.5rem;
      height: 2.5rem;
    }
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

</style>
