<template>
  <div v-on:click="onClick">
  </div>
</template>

<script>
export default {
  name: 'PublicFacilityBtn',
  methods: {
    onClick() {
      this.$emit('onclick')
    }
  }
}
</script>

<style scoped>

  div {

    background: url("../assets/public_fac1.png") no-repeat;
    background-size: 2.5rem;
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    bottom: 10rem;
    left: 1rem;
  }

</style>
