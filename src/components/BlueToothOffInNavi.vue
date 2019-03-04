<template>
  <div class="main">
    <div class="content">
      <div class="title">导航中断</div>
      <div class="msg">请在停车场内打开手机蓝牙开关</div>
      <div class="line"></div>
      <div class="btns">
        <div class="confirm" @click="doConfirm">知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BlueToothOffInNavi",
    methods: {

      doConfirm() {

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
    background: rgba(0, 0, 0, 0.6);
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

  .btns {

    width: 100%;
    color: #26a2ff;
    display: flex;
    justify-content: space-around;
    height: 5rem;

    > div {

      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.8rem;
    }
  }

  .title {

    padding: 2.5rem 0 0.5rem;
    font-size: 1.8rem;
  }

  .msg {

    padding: 0.5rem 0 3rem;
  }

</style>
