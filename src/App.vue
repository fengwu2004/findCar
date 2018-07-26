<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  export default {
    name: 'App'
  }

</script>

<style>

  * {
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none; }

  body, html {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0;
    overflow: hidden;
    font-family: "Microsoft Yahei", "Arial", "Helvetica"; }

  #alertbox {
    z-index: 999; }

  #debug {
    z-index: 2000;
    position: absolute;
    left: 2rem;
    top: 5rem;
    font-size: 1rem;
    visibility: hidden; }


</style>
