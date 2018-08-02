<template>
  <div class="main" @click="onClick">

  </div>
</template>

<script>
  export default {
    name:'FindCarBtn',
    methods:{
      onClick(){
        this.$emit('find-car')
      }
    }
  }

</script>

<style scoped>

  .main {

    position: absolute;
    z-index: 1000;
    left: 0.5rem;
    top: 14rem;
    width: 5rem;
    height: 5rem;
    background: url("../assets/fanxiangxunche.png") no-repeat center/100%;
  }

</style>
