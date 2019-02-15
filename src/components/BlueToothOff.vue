<template>
  <div class="main">
    <div class="content">
      <div class="title">蓝牙未开启</div>
      <div class="msg">室内导航需要开启手机蓝牙</div>
      <div class="line"></div>
      <div class="btns">
        <div class="cancel" @click="doCancel">取消</div>
        <div class="confirm" @click="doConfirm">{{settingTitle}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { idrCoreMgr } from "../../../indoorunMap/map";

  export default {
    name: "BlueToothOff",
    data(){
      return {
        settingTitle:null
      }
    },
    mounted(){

      if (idrCoreMgr.isAndroid) {

        this.settingTitle = "打开蓝牙"
      }
      else {

        this.settingTitle = "去设置"
      }
    },
    methods: {

      doConfirm() {

        this.$emit("do-confirm")
      },
      doCancel() {

        this.$emit("do-cancel")
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
