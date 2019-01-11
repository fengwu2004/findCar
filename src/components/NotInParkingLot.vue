<template>
  <div class="main">
    <div class="content">
      <div class="title">手机不在停车场范围内</div>
      <div class="msg">暂未检测到停车场的蓝牙信标</div>
      <div class="line"></div>
      <div class="confirm" @click="doConfirm">知道了</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NotInParkingLot",
    methods: {

      doConfirm() {

        console.log("confirm")

        this.$emit("do-confirm")
      }
    }
  }
</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: gray;
  }

  .content {

    width: 80%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 5px;
  }

  .line {

    height: 1px;
    width: 100%;
    background: gray;
    opacity: 0.5;
  }

  .confirm {

    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: #26a2ff;
    font-size: 1.8rem;
  }

  .title {

    padding: 2.5rem 0 0.5rem;
    font-size: 1.8rem;
  }

  .msg {

    padding: 0.5rem 0 3rem;
    font-size: 1.3rem;
  }

</style>
