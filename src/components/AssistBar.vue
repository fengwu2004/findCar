<template>
	<div class="main">
    <img src="../assets/dingwei.png" @click="showCarPos"/>
    <img src="../assets/shandeng.png" @click="carFlash"/>
    <img src="../assets/mingdi.png" @click="carWhistle"/>
  </div>
</template>

<script>
	export default {
		name: "AssistBar",
    methods: {

      showCarPos() {

        this.$emit("showCarPos")
      },
      carFlash() {

        if (doCarFlash) {

          doCarFlash()
        }
      },
      carWhistle() {

        if (doCarWhistle) {

          doCarWhistle()
        }
      }
    }
	}
</script>

<style scoped lang="scss">

  .main {

    position: absolute;
    right: 1.1rem;
    width: 2rem;
    top: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > img {

      width: 100%;
    }
  }

</style>
