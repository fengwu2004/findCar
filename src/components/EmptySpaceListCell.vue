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
    props:['data'],
	}
</script>

<style scoped lang="scss">

  .cell_main {

    background-color: white;
    border-bottom: 1px solid #DCDCDC;
    font-size: 0.6rem;
    color: #1B1C1C;
    width: 100%;
    display: flex;
    height: 2.5rem;
    justify-content: center;
    align-items: center;

    > div {

      flex: 1;
    }

    > div:first-child {

      padding-left: 1rem;
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
