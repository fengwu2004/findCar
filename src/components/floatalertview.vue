<template>
  <div class="main">
    <div class="msg">{{ msg }}</div>
  </div>

</template>

<script>
  export default {
    name:'floatalertview',
    props:['msg']
  }

</script>

<style scoped>

  .main {

    width: 70%;
    height: 4rem;
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 2rem;
    top: 0;
    bottom: 0;
    background-color: rgba(1, 1, 1, 0.4);
    margin:auto;
    display: flex;
    justify-content: center;
  }

  .msg {

    height: 100%;
    z-index: 1001;
    text-align: center;
    font-size: 1.4rem;
    color: white;
    padding-left: 2rem;
    padding-right: 2rem;
    line-height: 4rem;
  }
</style>
