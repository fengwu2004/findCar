<template>
  <div>
    <div class="header" @click="gotoMap">
      <span>{{data.parkName}}</span>
      <img src="../assets/ditu.png"/>
    </div>
    <empty-space-list-cell v-for="(list, index) in data.spaceOverviewList" v-bind:key="index" :data="list"></empty-space-list-cell>
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

        this.$router.push({name:'emptyspace', params:{regionId:this.data.regionId}})
      }
    }
	}
</script>

<style scoped lang="scss">

  .header {

    margin-top: 1rem;
    background: #E6E6E6;
    font-size: 1rem;
    color: #1B1C1C;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2rem;
    padding: 0 1rem;

    > img {

      width: 1rem;
      height: 1rem;
    }
  }

</style>
