<template>
  <div class="ernian-mian">
    <div class="content">
        <div class="left">
            <div v-for="(item, i) in menuList" :key="i">
                <div class="menu-item" @click="this.$router.push(item.url)"
                    :style="{animation: 'fadeInRight .5s'}">
                    {{item.name}}
                </div>
            </div>
        </div>
        <div class="right">
            <router-view v-slot="{ Component, route }">
                <transition :name="transitionName" mode="out-in">
                    <component :is="Component" :key="route.fullPath" />
                </transition>
            </router-view>
            <!-- <router-view></router-view> -->
        </div>
    </div>
    
  </div>
</template>

<script>
import PageLink from '@/components/PageLink'
import Button from '@/components/Button'
import router from '@/router/index.js'
export default {
    components: {PageLink, Button},
    data(){
        return{
            transitionName: 'com',
            menuList: [
                {
                    name: 'Button 按钮',
                    url: '/button'
                }
            ]
        }
    },
    created () {
        // 监听路由变化，更新transitionName
        router.afterEach((to, from) => {
        
        })
    },
}
</script>

<style>
h3{
    margin-top: 20px;
    margin-bottom: 10px;
}
.hljs{
    border-radius: 4px;
    font-size: 14px;
    font-family: Consolas;
    line-height: 22px;
    white-space: pre;
    word-wrap: normal;
    tab-size: 4;
    color: #abb2bf;
    background: #191b20;
}
.menu-item{
    color: #42b983;
    cursor: pointer;
    padding: 5px;
    font-weight: bolder;
    font-size: 22px;
    transition: transform .3s;
}
.menu-item:active{
    transform: scale(0.95);
}
.ernian-mian{
    margin-top: 90px;
    display: flex;
    justify-content: center;
    background: #fff;
}
.content{
    display: flex;
    gap: 20px;
    max-width: 1200px;
}
.left{
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.right{
    padding: 20px;
    flex: 1;
}

.main{
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.row{
  display: flex;
  gap: 20px;
  align-items: center;
}
.column{
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
</style>