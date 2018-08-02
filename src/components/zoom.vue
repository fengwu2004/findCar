<template>
  <div class="scale_btn">
    <div v-on:click="zoomout">
      <img src="../assets/zoomout.png">
    </div>
    <div v-on:click="zoomin">
      <img src="../assets/zoomin.png">
    </div>
  </div>
</template>

<script>
  export default {
    name : 'Zoom',
    props:['map'],
    data() {
      return {
        time:null
      }
    },
    methods: {
      zoomout:function() {

        var time = (new Date()).getTime()

        if (!this.time || time - this.time > 1000) {

          this.map.zoom(0.75)

          this.time = time
        }
      },
      zoomin:function() {

        var time = (new Date()).getTime()

        if (!this.time || time - this.time > 1000) {

          this.map.zoom(1.35)

          this.time = time
        }
      },
    }
  }
</script>

<style scoped>

  .scale_btn{

    position: absolute;
    right:1rem;
    bottom:10rem;
  }

  .scale_btn div {

    width: 3.5rem;
    height: 3.5rem;
  }

  .scale_btn div img{

    width: 100%;
    height: 100%;
  }

</style>
