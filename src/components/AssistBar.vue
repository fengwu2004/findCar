<template>
  <div class="main">
    <div>
      <img src="../assets/shandeng.png" @click="carFlash"/>
      <span>闪灯</span>
    </div>
    <div>
      <div class="line"></div>
      <img src="../assets/mingdi.png" @click="carWhistle"/>
      <span>鸣笛</span>
    </div>
    <div>
      <div class="line"></div>
      <img src="../assets/dingwei.png" @click="showCarPos"/>
      <span>寻车</span>
    </div>
  </div>
</template>

<script>
  import {idrCoreMgr} from "../../../indoorunMap/map";

  export default {
    name: "AssistBar",
    methods: {

      showCarPos() {

        this.$emit("showCarPos")
      },
      carFlash() {

        if (idrCoreMgr.isAndroid) {

          window.android.doCarFlash()
        }
        else {

          window.webkit.messageHandlers.doCarFlash.postMessage({})
        }
      },
      carWhistle() {

        if (idrCoreMgr.isAndroid) {

          window.android.doCarWhistle()
        }
        else {

          window.webkit.messageHandlers.doCarWhistle.postMessage({})
        }
      }
    }
  }
</script>

<style scoped lang="scss">

  $btnwidth:3rem;

  .main {

    position: absolute;
    right: 1.1rem;
    width: $btnwidth;
    top: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .main > div {

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;

    > img {

      margin-top: 0.6rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    > span {

      color: #2B3547;
      padding: 0.3rem;
    }
  }

  .line {

    background: #EDEDED;
    width: 75%;
    height: 1px;
  }

  .main > div:first-child {

    border-top-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
  }

  .main > div:last-child {

    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

</style>
