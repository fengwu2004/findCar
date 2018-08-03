<template>
  <div class="main" @click="onClose">
    <div class="content">
      <div>车位使用情况</div>
      <div>车位编号：{{unit.name}}</div>
      <div>车位类型：{{unit.fakeName}}</div>
      <div>使用情况：<span v-if="unit.spaceStatus" style="color: #dc6e6e;">已停车位</span><span v-else style="color: #82c33b;">空车位</span></div>
    </div>
    <div class="navibtn" v-if="enableNavi" @click="onNavi">导航</div>
  </div>
</template>

<script>
  export default {
    name: "EmptySpaceDetail",
    props:{
      enableNavi:Boolean,
      unit:{
        spaceStatus:Boolean,
        name:String,
        fakeName:String,
      }
    },
    methods:{
      onClose() {

        this.$emit('onClose')
      },
      onNavi() {

        this.$emit('onNavi', this.unit)
      }
    }
  }
</script>

<style scoped lang="scss">

  .main {

    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding-top: 20rem;
    background-color: rgba(1, 1, 1, 0.5);
  }

  .content {

    width: 80%;
    top: 20%;
    background: white;
    border-radius: 1rem;

    > div {

      padding: 1rem;
      font-size: 1.7rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #a7a49d;
      color: #636363;
    }

    > div:first-child {

      color: #000000;
    }

    > div:last-child {

      border-bottom: none;
    }
  }

  .navibtn {

    width: 80%;
    margin-top: 2rem;
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: #3984DD;
    border: 1px solid #3984DD;
    border-radius: 0.6rem;
    font-size: 1.4rem;
  }

</style>
