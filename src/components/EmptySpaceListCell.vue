<template>
	<div class="cell_main">
    <div>{{name}}</div>
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
        areaName:String,
        totalCount:Number,
        parkingCount:Number,
        emptyCount:Number
      }
    },
    computed:{
		  name:function () {

		    let areaName = this.data.areaName

		    if (!areaName) {

		      return '全部'
        }

        if (areaName.indexOf('VIP') != -1) {

          return 'VIP'
        }

        if (areaName.indexOf('企业') != -1) {

          return '企业'
        }

        if (areaName.indexOf('临时') != -1) {

          return '临时'
        }

        if (areaName.indexOf('酒店') != -1) {

          return '酒店'
        }

        if (areaName.indexOf('月租') != -1) {

          return '月租'
        }

        return areaName
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
