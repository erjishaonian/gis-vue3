<template>
  <div class="home">
    <!-- <div class="quotation-mark">引号</div> -->
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <Modal :show="false">
      <div>modal</div>
    </Modal>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Modal from '@/components/Modal.vue'


export default {
  name: 'HomeView',
  components: {
    HelloWorld, Modal
  },
  created () {
    this.$axios.get('/posts')
      .then(response => {
        this.posts = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
.quotation-mark {
  width: 100px;
  height: 40px;
  background-color: black;
  color: aliceblue;
  clip-path: polygon(
    10% 0%,
    10% 50%,
    0% 50%,
    0% 100%,
    90% 100%,
    90% 50%,
    100% 50%,
    100% 0%
  );
  transition: clip-path .5s ease;
  z-index: 9999;
  position: absolute;
  top: 500px;
  left: 10px;
}
.quotation-mark:hover{
clip-path: none;
}
</style>