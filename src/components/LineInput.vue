<template>
  <div class="main">
    <div class="label" v-if="labelShowThis">{{label}}</div>
    <div class="box" :style="{fontSize: fontSize+'px',animation: boxAnimation}">
      <div class="empty-label" v-if="(label===null)&&(placeholder&&placeholder!=='')" :style="{height: fontSize*1.2+'px'}"></div>
      <div class="content">
        
        <div class="input">
          <input 
              :placeholder="(label===null)?'':placeholder" 
              @click="click" 
              :style="{fontSize: fontSize+'px',color: color}"
              @focus="focus"
              @blur="blur"
              :value="value" 
              @input="input"
              />
          <div class="placeholder" v-if="label===null" :style="placeholderStyle">{{placeholder}}</div>
        </div>
        <div class="icon" v-if="icon">
          <slot/>
        </div>
      </div>
      <div class="line">
        <Transition name="tip">
          <!-- 报错文字 -->
          <div class="error-tip" v-show="errorTipShow" :style="{fontSize: fontSize*0.7+'px'}">{{errorTip}}</div>
        </Transition>
        <div class="focus-line" :style="focusLineStyle"></div>
        <div class="error-line" :style="errorLineStyle"></div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { debounce } from '@/assets/untils/untils.js'
import { defineExpose } from 'vue';
export default {
  // 注册时可以简写为驼峰
  emits:["update:modelValue"],
  computed:{
      value:{
          // 如果正常访问,返回给this.modelValue
          get(){
            return this.modelValue;
          },
          set(newV){
            // 通过触发自定义事件的形式让父组件帮我们更新他的数据，以达到双向绑定效果
            this.$emit("update:modelValue",newV)
          }
      },
  },
  props:{
    icon:{
      value: Boolean,
      default: false
    },
    fontSize: {
      value: Number,
      default: 16
    },
    label: {
      value: String,
      default: null
    },
    labelShow: {
      value: Boolean,
      default: false
    },
    placeholder: {
      value: String,
      default: null
    },
    color: {
      value: String,
      default: '#555555'
    },
    modelValue:String,
  },
  watch: {
    
  },
  data(){
    return{
      placeholderStyle: {
        top: '0',
        left: '10px',
        fontSize: this.fontSize + 'px'
      },
      boxAnimation: '',
      labelShowThis: this.labelShow,
      errorTip: '',
      errorTipShow: false,
      errorLineStyle: {
        maxWidth: '0%',
        left: 0,      
        boxShadow: '0 0 5px #f56c6c00'
      },
      focusLineStyle: {
        maxWidth: '0%',
        left: 0,      
        boxShadow: '0 0 5px #f56c6c00'
      }
    }
  },
  methods: {
    input(e){
      this.value = e.target.value
    },
    blur(){
      if(this.value === ''){
        this.placeholderStyle = {
          top: '0',
          left: '10px',
          fontSize: this.fontSize + 'px'
        }
      }
      this.focusLineStyle = {
        maxWidth: '0%',
        right: 0,      
        boxShadow: '0 0 5px #f56c6c00'
      }
    },
    focus(){
      if(this.value === '')
      {
        this.placeholderStyle = {
          top: '-' + this.fontSize*1.4 + 'px',
          left: '0',
          fontSize: this.fontSize/2 + 'px'
        }
      }
      this.focusLineStyle = {
        maxWidth: '100%',
        left: 0,      
        boxShadow: '0 0 5px #f56c6c00'
      }
    },
    click: debounce(()=>{
      // console.log('click')
    }, 1000),
    shake(tip){
      this.errorTip = ''
      this.errorTip = tip
      this.errorTipShow = true
      this.boxAnimation = 'shakeX 1s'
      this.errorLineStyle = {
        maxWidth: '100%',
        left: '0',      
        boxShadow: '0 0 5px #f56c6c'
      }
      setTimeout(() => {
        this.boxAnimation = ''
      }, 500)
      this.shakeOver(this)
    },
    shakeOver: debounce((that) => {
      that.errorTipShow = false
      that.errorLineStyle = {
        maxWidth: '0%',
        right: '0',      
        boxShadow: '0 0 5px #f56c6c00'
      }
    }, 5000),

  },
  created(){
    if(this.value !== ''){
      this.placeholderStyle = {
        top: '-' + this.fontSize*1.4 + 'px',
        left: '0',
        fontSize: this.fontSize/2 + 'px'
      }
    }
    if(this.label && this.label !== ''){
      this.labelShowThis = true
    }
  }
}
let shake = () => {
  
}
defineExpose({shake})
</script>

<style scoped>
input{
  outline: none;
  border: none;
  background: transparent;
  padding: 4px 10px;
  caret-color: #ddd;
  width: 100%;
}
.error-tip{
  color: #F56C6C;
  position: absolute;
  top: 8px;
  left: 4px;
}
.placeholder{
  position: absolute;
  color: #888;
  transition: .3s;
}
.empty-label{
  width: 100%;
}
.input{
  flex: 1;
  position: relative;
}
.main{
    width: 100%;
    display: flex;
    flex-direction: row;
}
.line{
  height: 2px;
  width: 100%;
  background: #555;
  margin-top: 4px;
  position: relative;
}
.box{
  width: 100%;
  position: relative;
}
.content{
  display: flex;
  flex-direction: row;
  width: 100%;
}
.icon{
  width: 24px;
  display: flex;
  align-items: center;
}
.label{
  white-space: nowrap;
  padding-right: 20px;
  padding-top: 1px;
}
.focus-line{
  position: absolute;
  background: linear-gradient(to right, #FF8570 0%, #418CB7 100%);
  height: 2px;
  transition: .7s;
  width: 100%;
}
.error-line{
  position: absolute;
  background: #F56C6C;
  height: 2px;
  transition: .7s;
  width: 100%;
}


/* 定义进入动画 */
.tip-enter-active { 
    animation: zoomIn .1s, fadeInDown .2s ;
}
/* 定义离开动画 */
.tip-leave-active {
    animation: zoomOut .3s, fadeOutUp .2s;
}
</style>