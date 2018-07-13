<template>
  <div>
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

  export default {
    name : 'navigation',
    methods: {
      exit() {

        this.$emit('stopnavigate')
      },
      birdlook() {

        this.$emit('birdlook')
      }
    }
  }

</script>

<style scoped lang="scss">

  .bottombar {

    position: absolute;
    bottom: 0;
    display: flex;
    height: 3rem;
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

      position: absolute;
      width: 100%;
      color: #3984DD;
      line-height: 5.6rem;;
      left: 50%;
      transform: translateX(-50%);
    }
  }

</style>
