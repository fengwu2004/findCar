<template>
  <div class="paopao_main">
    <div class="paopao" @click="enterRegion()">
      <span>{{region.emptyCount}}</span>
    </div>
    <div class="btn" @click="enterRegion()">{{region.name}}</div>
  </div>
</template>

<script>
	export default {
	  props:{
      region:{
        emptyCount:Number,
        name:String,
	      regionId:String,
        parkCode:String
      }
    },
		name: "EmptyPaopao",
    methods:{
	    enterRegion() {

        this.$router.push({path:'/emptyspace', query:{regionId:this.region.regionId, parkCode:this.region.parkCode}})
      }
    }
	}
</script>

<style scoped lang="scss">

  .paopao_main {

    width: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .paopao {

    margin-bottom: 0.5rem;
    width: 4.3rem;
    height: 5rem;
    background: url("../assets/paopao.png") no-repeat center/100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {

      padding-top: 1.3rem;
      color: #0CB175;
      font-size: 1.2rem;
    }
  }

  .btn {

    background: #0cb175;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
    border-radius: 4.5px;
    font-size: 1.2rem;
    color: #fff;
    width: 10rem;
    height: 3rem;
    text-align: center;
    line-height: 3rem;
  }

</style>
