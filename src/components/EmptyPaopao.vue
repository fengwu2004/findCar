<template>
  <div class="paopao_main">
    <div class="paopao">
      <span>{{count}}</span>
    </div>
    <div class="btn" @click="enterRegion(2)">产业一停车场</div>
  </div>

</template>

<script>
	export default {
	  props:{
	    name:String,
      count:Number
    },
		name: "EmptyPaopao"
	}
</script>

<style scoped lang="scss">

  .paopao_main {

    width: 10rem;
    height: 6rem;
  }

  .paopao {

    width: 4.3rem;
    height: 5rem;
    background: url("../assets/paopao.png") no-repeat center/100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {

      color: white;
      font-size: 0.8rem;
    }
  }

  .btn {

    background: #0cb175;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
    border-radius: 4.5px;
    font-size: 1.4rem;
    color: #fff;
    width: 10rem;
    height: 3rem;
    text-align: center;
    line-height: 3rem;
  }

</style>
