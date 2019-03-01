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

  $width:4rem;

  div {

    position: absolute;
    left: 2rem;
    bottom: 12.5rem;
    z-index: 0;
  }

  .notLocating {

    background: url("../assets/location1.png") no-repeat;
    background-size: $width;
    width: $width;
    height: $width;
  }

  .inLocating {

    background: url("../assets/location2.png") no-repeat;
    background-size: $width;
    width: $width;
    height: $width;
  }

</style>
