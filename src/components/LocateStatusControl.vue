<template>
  <div v-bind:class="getStyle" v-on:click="onClick"></div>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {
    name: 'LocateStatusControl',
    props: ['dolocate'],
    computed: {
      ...mapGetters([

        'navigation'
      ]),
      getStyle() {

        if (this.navigation.start) {

          return 'inNavi'
        }

        return 'notNavi'
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
    z-index: 0;
    background: url("../assets/location1.png") no-repeat;
    background-size: $width;
    width: $width;
    height: $width;
  }

  .notNavi {

    bottom: 13.25rem;
  }

  .inNavi {

    bottom: 10rem;
  }

</style>
