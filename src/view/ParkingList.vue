<template>
	<div class="main">
    <div class="chanye1 btn" @click="enterRegion(2)">产业一停车场</div>
    <div class="chanye2 btn" @click="enterRegion(3)">产业二停车场</div>
    <div class="jiudian btn" @click="enterRegion(0)">酒店停车场</div>
    <div class="zhanting btn" @click="enterRegion(1)">展厅停车场</div>
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
		  enterRegion(index) {

		    if (index < 0 || index >= 4) {

		      return
        }

        let region = this.regionList[index]

        this.gotoRegion(region.regionId, region.parkCode)
      },
      gotoRegion(regionId, parkCode) {

        idrLocateServerInstance.stop()

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

        this.gotoRegion(regionId, parkCode)
      },
      doLocateFailed() {

        this.regionIndex += 1

        this.doLocate()
      },
      nextRegion() {

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

            if (msg == 'Bluetooth_poweroff') {

              HeaderTip.show('蓝牙未开启，请打开蓝牙')
            }
            else {

              HeaderTip.show(msg)
            }
          })
      }
    },
    mounted() {

      // this.doLocate()
    }
	}
</script>

<style scoped lang="scss">

  .main {

    background: url("../assets/totalmap.jpg") no-repeat center/100% 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding-top: 3rem;
  }

  .btn {

    background: #3C961E;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.30);
    border-radius: 4.5px;
    font-size: 1.4rem;
    color: #fff;
    width: 11rem;
    height: 3rem;
    text-align: center;
    line-height: 3rem;
  }

  .chanye1 {

    position: absolute;
    left: 2rem;
    top: 18rem;
  }

  .chanye2 {

    position: absolute;
    left: 8rem;
    top: 23rem;
  }

  .jiudian {

    position: absolute;
    right: 1.6rem;
    top: 15.4rem;
  }

  .zhanting {

    position: absolute;
    right: 1rem;
    top: 9.5rem;
  }

</style>
