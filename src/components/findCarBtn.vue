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
    z-index: 1001;
    left: 0.5rem;
    top: 8rem;
    width: 4rem;
    height: 4rem;
    background: url("../assets/fanxiangxunche.png") no-repeat center/100%;
  }

</style>
