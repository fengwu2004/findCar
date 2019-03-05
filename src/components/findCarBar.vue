<template>
  <div class="main">
    <div class="content">
      <div class="detail">
        <span>{{parkingUnitName}}</span>
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
    },
    computed:{

      parkingUnitName() {

        return this.unit.floorName + '层 ' + this.unit.name
      }
    }
  }

</script>

<style scoped lang="scss">

  $width:calc(100% - 2rem - 2rem);

  .main {

    position: absolute;
    height: 9.25rem;
    bottom: 2rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {

    width: $width;
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
    margin-left: 1.6rem;

    > span:first-child {

      padding-top: 1.6rem;
      padding-bottom: 0.45rem;
      font-size: 1.8rem;
    }

    > span:last-child {

      padding-top: 0.45rem;
      padding-bottom: 1.6rem;
      font-size: 1.2rem;
    }
  }

  .combin {

    display: flex;
    align-items: center;
  }


  .btn {

    width: 10.1rem;
    display: flex;
    height: 3.8rem;
    justify-content: center;
    align-items: center;
    margin-right: 1.6rem;
    border: 1px solid #32ADEA;
    border-radius: 2rem;
    flex: 1;

    > img {

      width: 1.5rem;
      height: 1.5rem;
      padding-right: 0.5rem;
    }

    > span {

      color: #32ADEA;
      font-size: 1.4rem;
    }
  }

</style>
