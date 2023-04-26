<template>
<div>
  <div class="top" :style="{
      color: topStyle.color||'#eeeeee', 
      background: topStyle.background
      }"
      :class="{'bf': !isTop}"
      >
      
      <!-- <img class="image" src="@/assets/img/logo-white.png" @click="this.$router.push('index')"> -->
      <div class="title" @click="this.$router.push('index')">{{topMenu.title}}</div>
      <div style="flex:0.3"></div>
      <div v-for="(item, i) in topMenu.list" :key="i" 
        class="router button-bottom-line"
        @click="this.$router.push(item.url)"
        >{{item.name}}</div>
      <div style="flex:1"></div>
      <div v-show="topMenu.loginShow" class="login button-bottom-line" @click="loginModalOpen">登录</div>
  </div>
  <router-view v-slot="{ Component, route }" style="min-width: 900px">
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
        <LineInput :icon="true" :placeholderColor="'#333333'" :fontSize="20" :placeholder="'账号'" v-model="user.username" ref="username"><User /></LineInput>
        <LineInput :icon="true" :placeholderColor="'#333333'" :fontSize="20" :placeholder="'密码'" v-model="user.password" type="password" ref="password"><Lock /></LineInput>
        
      </div>
    </div>
  </Modal>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import router from './router/index.js'
import '@/assets/untils/button.bottom.line.css'
import Modal from '@/components/Modal.vue'
import LineInput from '@/components/LineInput.vue'
import {throttle} from '@/assets/untils/untils.js'

export default defineComponent({
  name: 'App',
  components: {
    Modal, LineInput
  },
  data () {
    return {
      transitionName: 'page',
      loginShow: false,
      user:{
        username: '',
        password: ''
      },
      topStyle: {
        color: null,
        background: null
      },
      isTop: false,
      topMenu: {
        title: '智慧农业',
        url: '/index',
        list: [{
          name: '地图展示',
          url: '/gis'
        },{
          name: '气象预警',
          url: '/index'
        },{
          name: '专家指导',
          url: '/index'
        },{
          name: 'OA审批',
          url: '/index'
        }],
        loginShow: true
      }
    }
  },
  created () {
    // 监听路由变化，更新transitionName
    router.afterEach((to, from) => {
      // console.log(to)
      if(to.meta && to.meta.topMenu){
        this.topMenu = to.meta.topMenu
      }
      if(to.meta && to.meta.topStyle)
        this.topStyle = to.meta.topStyle
      else
        this.topStyle = {
          color: '#eeeeee',
          background: '#000000',
          keep: 'none'
        }
      this.topTrandorm()
    })
  },
  mounted () {
    // this.topTrandorm()
    //节流 100内执行一次
    window.addEventListener('scroll', throttle(this.topTrandorm, 100))
  },
  unmounted(){
    window.removeEventListener('scroll')
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
      // console.log(this.topStyle.background)
      //置顶
      if(e){
        this.topStyle.background = this.topStyle.background.substring(0,7) + '00'
      }
      //未置顶
      else{
        this.topStyle.background = this.topStyle.background.substring(0,7) + 'bb'
      }
    },
    topTrandorm(){
      let scrollPosition = window.pageYOffset
      if(scrollPosition > 20){
        if(!this.isTop) return
        this.isTop = false
        this.topChange(false)
      }
      else if(scrollPosition <= 20){
        this.isTop = true
        this.topChange(true)
      }
      return
    }
  }
})
</script>


<style lang="scss" scoped>
#app {
  font-family: '黑体';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
  // backdrop-filter: blur(3px);
  min-width: 900px;
  flex-direction: row;
  z-index: 999;
  align-items: center;
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
.bf{
  backdrop-filter: blur(3px);
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
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
*{
  margin: 0;
  padding: 0;
}
</style>
