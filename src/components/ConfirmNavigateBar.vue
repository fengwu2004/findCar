<template>
  <div  v-on:click="onclick">开始导航</div>
</template>

<script>
export default {

  name : 'ConfirmNavigateBar',

  methods: {

    onclick:function() {

      this.$emit('confirmNavigate')
    }
  }
}
</script>

<style scoped>

  div {

    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 4rem;
    font-size: 1.4rem;
    width: 80%;
    color: white;
    background: #3984DD;
    border-radius: 50px;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
