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
    background-size: 3.5rem;
    width: 3.5rem;
    height: 3.5rem;
    position: absolute;
    bottom: 23.5rem;
    left: 1rem;
  }

</style>
