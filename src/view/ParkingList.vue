<template>
	<div class="main">
    <div class="cell" v-for="region in regionList" v-bind:key="region.regionId" @click="gotoRegion(region.regionId)">
      <span>{{region.name}}</span><img src="../assets/qianwang.png"/>
    </div>
  </div>
</template>

<script>
	export default {

		name: "ParkingList",
    data(){
		  return {
		    regionList:[
		      {name:'潼湖科技小镇_商业停车场', regionId:'15313792400143094'},
          {name:'潼湖科技小镇_展厅停车场', regionId:'14559560656150195'},
          {name:'潼湖科技小镇_产业1停车场', regionId:'14533784131830010'},
          {name:'潼湖科技小镇_产业2停车场', regionId:'14504321009170013'}]
      }
    },
    methods:{
      gotoRegion(regionId) {

        this.$router.push({name:'map', params:{regionId}})
      }
    }
	}
</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    bottom: 0;
    top: 0;
    background: #F0EFF6;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding-top: 3rem;
  }

  .cell {

    margin-top: 1rem;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: #FFFFFF;
    border: 1px solid rgba(219,223,227,0.30);
    box-shadow: 0 5px 12px 0 rgba(217,226,233,0.50);
    border-radius: 3px;

    >span {

      color: #485465;
      font-size: 0.8rem;
    }

    >img {

      width: 0.5rem;
    }
  }

</style>
