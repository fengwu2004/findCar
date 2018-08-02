<template>
  <div v-bind:class="getStyle" v-on:click="onClick"></div>
</template>

<script>
  export default {
    name: 'LocateStatusControl',
    props: ['dolocate'],
    computed: {
      getStyle() {
        if (this.dolocate) {

          return 'inLocating'
        }

        return 'notLocating'
      }
    },
    methods: {
      onClick() {

        this.$emit('onclick', !this.dolocate)
      }
    }
  }
</script>

<style scoped lang="scss">

  div {

    position: absolute;
    left: 1rem;
    bottom: 10rem;
  }

  .notLocating {

    background: url("../assets/location1.png") no-repeat;
    background-size: 3.5rem;
    width: 3.5rem;
    height: 3.5rem;
  }

  .inLocating {

    background: url("../assets/location2.png") no-repeat;
    background-size: 3.5rem;
    width: 3.5rem;
    height: 3.5rem;
  }

</style>
