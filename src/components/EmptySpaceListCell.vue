<template>
	<div class="cell_main">
    <div>{{data.spaceType ? data.spaceType : '全部'}}</div>
    <div>{{data.totalCount}}</div>
    <div class="parkingCount">{{data.parkingCount}}</div>
    <div class="emptyCount">{{data.emptyCount}}</div>
  </div>
</template>

<script>

	export default {
		name: "EmptySpaceListCell",
    props:{
		  data:{
        spaceType:String,
        totalCount:Number,
        parkingCount:Number,
        emptyCount:Number
      }
    },
	}
</script>

<style scoped lang="scss">

  .cell_main {

    background-color: white;
    border-bottom: 1px solid #DCDCDC;
    font-size: 1.2rem;
    color: #1B1C1C;
    width: 100%;
    display: flex;
    height: 3.8rem;
    justify-content: center;
    align-items: center;

    > div {

      flex: 1;
    }

    > div:first-child {

      padding-left: 1.5rem;
    }
  }

  .cell_main:last-child {

    border-bottom:none;
  }

  .parkingCount {

    color: #FF465D;
  }

  .emptyCount {

    color: #7ED321 ;
  }

</style>
