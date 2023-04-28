<template>
    <div class="checkbox-main" 
        @click="checkBoxClick"
        @mouseover="mouseover"
        @mouseout="mouseout"
        :style="{
            background: mainBackground,
            animation: animation
        }">
        <div class="checkbox-box" 
            :style="{
                borderColor: color,
                height: size+'px',
                width: size+'px'
            }">
            <div class="checkbox-box-main"
                :style="{
                    width: boxMainSize,
                    height: boxMainSize,
                    background: color
                }">

            </div>
        </div>
        <div class="checkbox-label">
            {{label}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'CheckBox',
    props: {
        label: {
            value: String,
            default: null
        },
        size: {
            value: Number,
            default: 18
        },
        color: {
            value: String,
            default: '#0077ff'
        },
        modelValue: {
            value: Boolean,
            default: false
        },
    },
    watch: {
        value(oldV, newV){
            //取消
            if(oldV){
                this.check()
            }
            //选中
            else if(oldV === false){
                this.uncheck()
            }
        }
    },
    data(){
        return{
            mainBackground: '',
            boxMainSize: '0%',
            animation: ''
        }
    },
    created(){
        // console.log(this.modelValue)
        if(this.modelValue){
            this.check()
        }
    },
    methods: {
        checkBoxClick(){
            //取消
            if(this.modelValue){
                this.value = false
                this.uncheck()
            }
            //选中
            else{
                this.value = true
                this.check()
            }
        },
        uncheck(){
            this.boxMainSize = '0%'
            this.animation = 'checkbox-click-454710 .3s'
            setTimeout(() => {
                this.animation = ''
            }, 300);
        },
        check(){
            this.boxMainSize = '100%'
            this.animation = 'checkbox-click-454710 .3s'
            setTimeout(() => {
                this.animation = ''
            }, 300);
        },
        mouseover(){
            if(this.label)
                this.mainBackground = this.color + '18'
        },
        mouseout(){
            this.mainBackground = ''
        }
    },
    emits:["update:modelValue", "update:change"],
    computed:{
        value:{
            // 如果正常访问,返回给this.modelValue
            get(){
                return this.modelValue;
            },
            set(newV){
                // 通过触发自定义事件的形式让父组件帮我们更新他的数据，以达到双向绑定效果
                this.$emit("update:modelValue",newV)
                this.$emit("update:change",newV)
            }
        },
    }
}
</script>

<style scoped>
.checkbox-main{
    display: flex;
    cursor: pointer;
    gap: 8px;
    align-items: center;
    padding: 6px;
    border-radius: 6px;
    transition: all .3s;
}
.checkbox-box{
    border-style: solid;
    border-radius: 4px;
    border-width: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.checkbox-box-main{
    transition: all .08s ease-out;
}
.checkbox-label{
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
}
</style>
<style>
@keyframes checkbox-click-454710 {
    20% {
        transform: scale(0.95);
    }
    60% {
        transform: scale(1.02);
    }
}
</style>