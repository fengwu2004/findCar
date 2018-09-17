<template>
  <div class="main">
    <div v-show="linting" class="linting"><div></div>临停</div>
    <div v-show="qiye" class="qiye"><div></div>企业</div>
    <div v-show="vip" class="vip"><div></div>VIP</div>
    <div class="chongdianzhuang"><div></div>充电桩</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "UnitColorInstument",
    data(){
      return {

        linting:false,
        qiye:false,
        vip:false
      }
    },
    computed: {
      ...mapGetters([
        'parkingdetail'
      ]),
    },
    mounted() {

      console.log(this.parkingdetail)

      this.parkingdetail.spaceOverviewList.forEach(overview=>{

        if (overview.areaName.indexOf('临时') != -1) {

          this.linting = true
        }

        if (overview.areaName.indexOf('VIP') != -1) {

          this.vip = true
        }

        if (overview.areaName.indexOf('企业') != -1) {

          this.qiye = true
        }
      })
    }
  }
</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    left: 1rem;
    bottom: 16rem;
    width: 5.75rem;
    background: rgba(255, 255, 255, 0.85);

    display: flex;
    flex-direction: column;
  }

  div {

    color: #000;
    font-size: 0.8rem;
  }

  .main > div {

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 5px;
  }

  .linting > div {

    box-sizing: border-box;
    border: 1px solid #c8c8c8;
    width: 1.25rem;
    height: 2.5rem;
    margin-right: 0.5rem;
    background-color: #32BEDC;
  }

  .qiye > div {

    box-sizing: border-box;
    border: 1px solid #c8c8c8;
    width: 1.25rem;
    height: 2.5rem;
    margin-right: 0.5rem;
    background-color: #00B478;
  }

  .vip > div {

    box-sizing: border-box;
    border: 1px solid #c8c8c8;
    width: 1.25rem;
    height: 2.5rem;
    margin-right: 0.5rem;
    background-color:  #AA73CD;
  }

  .chongdianzhuang > div {

    width: 1.25rem;
    margin-right: 0.5rem;
    height: 2.5rem;
    background: url("../assets/chongdianzhuangicon.png") no-repeat center/100% 100%;
  }

</style>
