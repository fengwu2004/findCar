<template>
  <div @click="onClick">
    <p>取消选点</p>
  </div>
</template>

<script>
export default {
  name: 'MarkInMap',
  methods:{
    onClick() {

      this.$store.dispatch('finishMarkInMap')
    }
  }
}
</script>

<style scoped>

  div {
    position: absolute;
    bottom: 0;
    background: #1B1C1C;
    width: 100%;
    height: 1.6rem;
    padding: 0.7rem 0;
    text-align: center;
  }

  p {
    color: white;
    line-height: 1.6rem;
    height: 1.6rem;
    margin: 0;
  }

</style>
