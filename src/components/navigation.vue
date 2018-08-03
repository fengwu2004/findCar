<template>
  <div>
    <div class="topbar">
      <div class="rightorleft">
        <img v-if="navigation.nextLeft" src="../assets/left.png"/>
        <img v-else src="../assets/right.png"/>
      </div>
      <div class="navistatus">
        <div class="total">
          <div class="title">前方路口</div><div class="detail">全程剩余: {{navigation.totalDistance}}米 {{Math.ceil(navigation.totalDistance/60)}}分钟</div>
        </div>
        <div class="direction">
          <div>
            {{navigation.nextDistance}}米{{navigation.nextLeft?'  左转':'  右转'}}
          </div>
          <div v-if="navigation.enableSpeack" class="speaker" @click="speakControl()"></div>
          <div v-else class="speakeroff" @click="speakControl()"></div>
        </div>
      </div>
    </div>
    <div class='bottombar'>
      <div onClick={this.close}>
        <img src="../assets/quit.png" v-on:click="exit" width="20"/>
        <span class="line"/>
      </div>
      <div class="title" @click='birdlook'>查看全览</div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {
    name : 'navigation',
    computed: {
      ...mapGetters([
        'navigation'
      ])
    },
    data() {
      return {
        speakerOn:false,
      }
    },
    methods: {
      exit() {

        this.$emit('stop')
      },
      speakControl() {

        this.$store.dispatch('toggleSpeak')

        if (this.navigation.enableSpeack) {

          window.FloatView.show('语音播报已开启')
        }
        else {

          window.FloatView.show('语音播报已关闭')
        }
      },
      birdlook() {

        console.log('birdlook')

        this.$emit('birdlook')
      }
    }
  }

</script>

<style scoped lang="scss">

  .topbar {

    position: absolute;
    top: 0;
    width: 100%;
    background: #18202A;
    display: flex;
  }

  .rightorleft {

    > img {

      padding: 1rem;
      width: 5.75rem;
    }
  }

  .navistatus {

    padding-top: 1rem;
    flex: 1;

    .total {

      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .title {

        color:#C8C8C8;
        font-size: 1.5rem;
      }

      .detail {

        font-size: 1.2rem;
        color: #C8C8C8;
        padding-right: 2rem;
      }
    }

    .direction {

      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 3.2rem;
      color: #3984DD;

      .speaker {

        width: 2rem;
        height: 2rem;
        margin-right: 2rem;
        background: url("../assets/speaker.png") no-repeat center/100%;
      }

      .speakeroff {

        width: 2rem;
        height: 2rem;
        margin-right: 2rem;
        background: url("../assets/speakeroff.png") no-repeat center/100%;
      }
    }
  }

  .bottombar {

    position: absolute;
    bottom: 0;
    display: flex;
    height: 5.6rem;
    align-items: center;
    background: #18202A;
    width: 100%;
    text-align: center;

    > div:first-child {

      width: 5.6rem;
      height: 100%;
      position: absolute;
      display: flex;
      align-items: center;
      z-index: 100;
      justify-content: center;
    }

    > img {

      margin: 1rem;
      position: absolute;
      z-index: 100;
    }

    .line {

      width: 1px;
      height: 1.6rem;
      position: absolute;
      right: 0;
      background-color: #c8c8c8;
    }

    .title {

      font-size: 1.5rem;
      position: absolute;
      width: 100%;
      color: #3984DD;
      line-height: 5.6rem;;
      left: 50%;
      transform: translateX(-50%);
    }
  }

</style>
