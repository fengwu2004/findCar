<template>
  <div class="main">
    <div class="content">
      <div class="detail">
        <span>B3层 C02</span>
        <span>小鹏智能产业园地下停车场</span>
      </div>
      <div class="combin">
        <div class="btn" @click="onClick">
          <img src="../assets/car.png"/>
          <span>开始导航</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:['unit', 'parkingname'],
    name:'FindCarBar',
    methods:{
      onClick(){
        this.$emit('find-car')
      }
    }
  }

</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    bottom: 2rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {

    width: 90%;
    display: flex;
    background-color: white;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
  }

  .detail {

    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1rem;

    > span {

      padding: 0.5rem 0;
    }

    > span:first-child {

      padding-top: 1rem;
      font-size: 1.8rem;
    }
  }

  .combin {

    display: flex;
    align-items: center;
  }


  .btn {

    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
    border: 2px solid #32ADEA;
    border-radius: 2rem;
    padding: 0.5rem 1rem;

    > img {

      width: 2rem;
      height: 2rem;
      padding-right: 0.5rem;
    }

    > span {

      color: #32ADEA;
      font-size: 1.4rem;
    }
  }

</style>
