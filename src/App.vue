<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/index">Index</router-link>
  </nav> -->
  <div class="top">
      <img class="image" src="@/assets/img/logo-white.png" @click="this.$router.push('index')">
      <div class="title" @click="this.$router.push('index')">智慧农业</div>
      <div style="flex:0.3"></div>
      <div class="router button-bottom-line">地图展示</div>
      <div class="router button-bottom-line">气象数据</div>
      <div class="router button-bottom-line">专家指导</div>
      <div class="router button-bottom-line">工作台</div>
      <div style="flex:1"></div>
      <div class="login button-bottom-line" @click="loginModalOpen">登录</div>
  </div>
  <router-view v-slot="{ Component, route }" @topChange="topChange">
    <transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>
  <Modal :show="loginShow" @close="loginClose" :width="600" :onlyContent="true" :borderRadius="20">
    <div class="modal-main">
      <div class="title">
        Login
      </div>
      <div class="input">
        <LineInput/>
      </div>
    </div>
  </Modal>
  <!-- <router-view/> -->
</template>

<script>
import { defineComponent } from 'vue'
import router from './router/index.js'
import '@/assets/untils/button.bottom.line.css'
import Modal from '@/components/Modal.vue'
import LineInput from '@/components/LineInput.vue'

export default defineComponent({
  name: 'App',
  components: {
    Modal, LineInput
  },
  data () {
    return {
      transitionName: 'page',
      loginShow: false
    }
  },
  created () {
    // 监听路由变化，更新transitionName
    router.afterEach((to, from) => {
      this.transitionName = transitionName
    })
  },
  mounted () {
    
  },
  methods: {
    loginModalOpen () {
      this.loginShow = true
    },
    loginClose () {
      this.loginShow = false
    },
    topChange (e) {
      // console.log(e)
      let top = document.getElementsByClassName('top')[0]
      //置顶
      if(e){
        top.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      }
      //未置顶
      else{
        top.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
      }
    }
  }
})
</script>


<style lang="scss" scoped>
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: '黑体';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.top{
  height: 90px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: row;
  z-index: 999;
  align-items: center;
  color: #eeeeee;
  .image{
    // width: 80px;
    height: 60px;
    margin-left: 20px;
    cursor: pointer;
  }
  .title{
    font-size: 26px;
    font-weight: bold;
    padding-left: 20px;
    cursor: pointer;
  }
  .router{
    font-size: 20px;
    margin-left: 30px;
  }
  .login{
    font-size: 18px;
    margin-right: 50px;
  }
  .router, .login{
    height: 32px;
  }
}
.modal-main{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .title{
    color: #555;
    font-size: 44px;
    font-weight: bolder;
    margin-bottom: 40px;
  }
  .input{
    width: 60%;
  }
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
*{
  margin: 0;
  padding: 0;
}
</style>
