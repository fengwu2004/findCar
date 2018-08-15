<template>
	<div class="main">
    <div class="cell" v-for="region in regionList" v-bind:key="region.regionId" @click="gotoRegion(region.regionId)">
      <span>{{region.name}}</span><img src="../assets/qianwang.png"/>
    </div>
  </div>
</template>

<script>

  import { idrLocateServerInstance } from "../../../indoorunMap/map";

  export default {

		name: "ParkingList",
    data(){
		  return {
		    regionList:[
		      {name:'潼湖科技小镇_商业停车场', regionId:'15313792400143094', floorId:'15313804821833137', parkCode:'th0714'},
          {name:'潼湖科技小镇_展厅停车场', regionId:'14559560656150195', floorId:'15323294861499896', parkCode:'th0730'},
          {name:'潼湖科技小镇_产业1停车场', regionId:'14533784131830010', floorId:'15323294173829181', parkCode:'th0731'},
          {name:'潼湖科技小镇_产业2停车场', regionId:'14504321009170013', floorId:'15323290763798360', parkCode:'th0732'}],
        regionIndex:0,
      }
    },
    beforeDestroy() {

      idrLocateServerInstance.stop()
    },
    methods:{
      gotoRegion(regionId, parkCode) {

        if (window.__wxjs_environment === 'miniprogram') {

          let value = 'parkCode+' + parkCode

          wx.miniProgram.navigateTo({url:'../paymain/paymain?' + value})
        }
        else {

          alert('请在小程序中打开')
        }
      },
      doLocateSuccess() {

        const { regionId, parkCode } =  this.regionList[this.regionIndex]

        idrLocateServerInstance.stop()

        this.gotoRegion(regionId, parkCode)
      },
      doLocateFailed() {

        this.regionIndex += 1

        this.doLocate()
      },
      async nextRegion() {

        if (this.regionIndex >= this.regionList.length) {

          return Promise.reject(null)
        }

        return Promise.resolve(this.regionList[this.regionIndex])
      },
      doLocate() {

        this.nextRegion()
          .then((regionId, floorId)=>{

            return idrLocateServerInstance.start(regionId, floorId)
          })
          .then(()=>{

            idrLocateServerInstance.setLocateDelegate(()=>{this.doLocateSuccess()}, ()=>this.doLocateFailed())
          })
          .catch(msg=>{

            if (msg) {

              window.HeaderTip.show(msg)
            }
          })
      }
    },
    created() {

      this.doLocate()
    }
	}
</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    bottom: 0;
    top: 0;
    background: #F0EFF6;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding-top: 3rem;
  }

  .cell {

    margin-top: 1rem;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: #FFFFFF;
    border: 1px solid rgba(219,223,227,0.30);
    box-shadow: 0 5px 12px 0 rgba(217,226,233,0.50);
    border-radius: 3px;

    >span {

      color: #485465;
      font-size: 0.8rem;
    }

    >img {

      width: 0.5rem;
    }
  }

</style>
