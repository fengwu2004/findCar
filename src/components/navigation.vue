<template>
  <div>
    <div class="top">
      <div class="reach" v-if="navigation.totalDistance < 15">
        <div>已到达目的地</div>
      </div>
      <div v-else class="topbar">
        <div class="rightorleft">
          <img src="../assets/front.png"/>
        </div>
        <div class="direction">
          <div v-if="navigation.nextdir === 0">直行<span>{{navigation.nextDistance}}米</span> 后左转</div>
          <div v-if="navigation.nextdir === 1">直行<span>{{navigation.nextDistance}}米</span> 后右转</div>
          <div v-if="navigation.nextdir === 2">直行<span>{{navigation.nextDistance}}米</span></div>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="navigation.totalDistance >= 15">
      <div v-if="!exitcheck" class='normal'>
        <div @click="askExit" class="exit">
          <span class="exittext">退出</span>
          <span class="line"/>
        </div>
        <div class="detail">全程剩余: <span>{{navigation.totalDistance}}</span>米 <span>{{Math.ceil(navigation.totalDistance/60)}}</span>分钟</div>
        <div>
          <div v-if="followStatus" class="title" @click='birdlook'>路线全览</div>
          <div v-else class="title" @click='changeToNavi'>恢复导航</div>
        </div>
      </div>
      <div v-else class="exitstatus">
        <div @click="exit">确认退出</div>
        <div class="line"></div>
        <div @click="cancelExit">取消</div>
      </div>
    </div>
    <div v-else class="mustexit">
      <div @click="exit">退出</div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {
    props: ["followStatus"],
    name : 'navigation',
    computed: {
      ...mapGetters([
        'navigation'
      ])
    },
    data() {
      return {
        exitcheck:false
      }
    },
    methods: {
      cancelExit() {

        this.exitcheck = false
      },
      exit() {

        this.$emit("stop")
      },
      askExit() {

        this.exitcheck = true
      },
      birdlook() {

        this.$emit('birdlook')
      },
      changeToNavi() {

        this.$emit('changeToNavigate')
      }
    }
  }

</script>

<style scoped lang="scss">

  .top {

    position: absolute;
    top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .topbar {

    border-radius: 0.5rem;
    width: 90%;
    height: 6rem;
    background: #18202A;
    opacity: 0.93;
    display: flex;
  }

  .reach {

    border-radius: 0.5rem;
    width: 90%;
    height: 6rem;
    background: #18202A;
    opacity: 0.93;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 3rem;
  }

  .rightorleft {

    > img {

      padding: 1rem;
      width: 4rem;
    }
  }

  .direction {

    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 3rem;
    color: #939AA9;

    > div > span {

      color: white;
    }

    .reachtarget {

      color: white;
    }
  }

  .bottom {

    display: flex;
    height: 5.6rem;
    width: 100%;
    bottom: 1rem;
    justify-content: center;
    position: absolute;
  }

  .normal {

    display: flex;
    width: 90%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 0.5rem;

    .detail {

      font-size: 1.4rem;
      color: #0F1520;

      > span {

        font-size: 2rem;
      }
    }

    .title {

      background-color: #32ADEA;
      color: white;
      font-size: 1.4rem;
      padding: 0.5rem 0.8rem;
      border-radius: 2rem;
      margin-right:1rem;
    }
  }

  .exit {

    display: flex;
    align-items: center;
    justify-content: center;

    .exittext {

      font-size: 1.6rem;
      margin: 2rem;
      color: #FC431D;
    }

    .line {

      width: 1px;
      height: 3rem;
      background: #C7C7C7;
    }
  }

  .exitstatus {

    display: flex;
    width: 90%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: white;
    border-radius: 0.5rem;
    font-size: 1.6rem;

    .line {

      width: 1px;
      height: 3rem;
      background: #C7C7C7;
    }

    > div:first-child {

      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: red;
    }

    > div:last-child {

      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #0F1520;
    }
  }

  .mustexit {

    display: flex;
    height: 5.6rem;
    width: 100%;
    bottom: 1rem;
    justify-content: center;
    position: absolute;

    > div {

      display: flex;
      width: 90%;
      height: 100%;
      justify-content: center;
      align-items: center;
      background: white;
      border-radius: 0.5rem;
      font-size: 1.6rem;
      color: #FC431D;
    }
  }

</style>
