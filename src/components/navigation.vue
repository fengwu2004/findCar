<template>
  <div>
    <div class="top">
      <div class="topbar">
        <div class="rightorleft">
          <img v-if="navigation.nextdir === 0" src="../assets/left.png"/>
          <img v-if="navigation.nextdir === 1" src="../assets/right.png"/>
          <img v-if="navigation.nextdir === 2" src="../assets/front.png"/>
        </div>
        <div class="direction">
          <div v-if="navigation.nextdir === 0">直行{{navigation.nextDistance}}米后 左转</div>
          <div v-if="navigation.nextdir === 1">直行{{navigation.nextDistance}}米后 右转</div>
          <div v-if="navigation.nextdir === 2">直行{{navigation.nextDistance}}米</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div v-if="!exitcheck" class='normal'>
        <div @click="askExit" class="exit">
          <span>退出</span>
          <span class="line"/>
        </div>
        <div class="detail">全程剩余: {{navigation.totalDistance}}米 {{Math.ceil(navigation.totalDistance/60)}}分钟</div>
        <div>
          <div v-if="followStatus" class="title" @click='birdlook'>路线全览</div>
          <div v-else class="title" @click='changeToNavi'>恢复导航</div>
        </div>
      </div>
      <div v-else class="exitstatus">
        <div @click="exit">确认退出</div>
        <div @click="cancelExit">取消</div>
      </div>
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
    background: #18202A;
    display: flex;
  }

  .rightorleft {

    > img {

      padding: 1rem;
      width: 5.75rem;
    }
  }

  .direction {

    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 3.2rem;
    color: #3984DD;
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

      font-size: 1.2rem;
      color: #C8C8C8;
    }

    .title {

      background-color: dodgerblue;
      color: white;
      padding: 0.5rem 0.8rem;
      border-radius: 1rem;
      margin-right: 2rem;
    }
  }

  .exit {

    display: flex;
    align-items: center;

    > span {

      margin: 1rem;
      color: red;
    }

    .line {

      width: 1px;
      height: 3rem;
      background-color: red;
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

    > div {

      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    > div:first-child {

      color: red;
    }
  }

</style>
