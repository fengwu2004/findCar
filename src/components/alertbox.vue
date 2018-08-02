<template>
  <div>
    <div class="bg"></div>
    <div class="content">
      <div v-show="title !== null" class="title">{{ title }}</div>
      <div v-show="message !== null" class="message">{{ message }}</div>
      <div class="btns" v-bind:style="{flexDirection:buttons.length > 2 ? 'column':'', borderTop:buttons.length > 2 ? 'none':'1px solid #a7a49d'}">
        <div class="btn" v-for="(button, index) in buttons" v-bind:key="button.name" v-on:click="callback(button)" v-bind:style="{borderTop:buttons.length > 2 ? '1px solid #a7a49d':'', borderLeft:buttons.length <= 2 && index == 1  ? '1px solid #a7a49d':'none'}" v-html="button.name"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'alertbox',
    props: ['message', 'title', 'buttons'],
    methods:{
      callback:function(button) {

        button.callback && button.callback()
      }
    },
  }

</script>

<style scoped>
  .bg {
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin: 0;
    background-color: black;
    opacity: 0.4;
    z-index: 1000;
  }

  .title {

    padding-top: 1rem;
    text-align: center;
    font-size: 1.7rem;
  }

  .message {

    font-size: 1.7rem;
    text-align: center;
    padding-bottom: 1rem;
  }

  .content {

    border-radius: 5px;
    background-color: white;
    position: absolute;
    left:0;
    right:0;
    width: 80%;
    top: 30%;
    margin:auto;
    z-index: 1001;
  }

  .btns {

    width: 100%;
    border-top:1px solid #a7a49d;
    display: flex;
  }

  .btns div {

    flex:1;
    height: 4.4rem;
    color:#0188fe;
    text-align: center;
    line-height: 4.4rem;
    font-size: 1.7rem;
  }

  .btn:nth-child(2) {

    border-left: 1px solid #a7a49d;
    box-sizing: border-box;
  }

  .btn:nth-child(3) {

    border-left: 1px solid #a7a49d;
    box-sizing: border-box;
  }

</style>
