<template>
    <div>
        <Transition name="modal">
            <div class="bk" v-show="show">
                
            </div>
        </Transition>
        <Transition name="fi">
            <div v-show="show" class="m" @click="close">
                <div class="main"  @click.stop="" :style="(width?'width:'+width+'px;':'')+(borderRadius?'border-radius:'+borderRadius+'px;overflow:hidden;':'')">
                    <div class="top">
                        <div class="title" v-if="!onlyContent">
                            Title
                        </div>
                        <div class="close" @click="close" :style="(borderRadius?'border-radius:0 0'+borderRadius+'px 0;':'')">
                            <el-icon class="icon" :size="24"><Close /></el-icon>
                        </div>
                    </div>
                    <slot style="flex: 1"></slot>
                    <div class="buttom" v-if="!onlyContent">
                        bottom
                    </div>
                </div>
            </div>
        </Transition>
    </div>
    
</template>

<script>
export default {
    props: {
        show: {
            value: Boolean,
            default: false
        },
        width: {
            value: Number,
            default: null
        },
        onlyContent: {
            value: Boolean,
            default: false
        },
        borderRadius: {
            value: Number,
            default: null
        }
    },
    watch: {
        show(oldV, newV){
            this.mShow = newV
            console.log(newV)
        }
    },
    data(){
        return{
            mShow: false
        }
    },
    created () {
        console.log('modal created')
    },
    methods: {
        close(){
            this.mShow = false
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.bk{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    z-index: 999;
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    
}
.m{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 1000;
}
.main{
    background-color: rgba(255, 255, 255, .5);
    height: 600px;
    z-index: 99999;
    width: 900px;
    position: fixed;
    backdrop-filter: blur(8px);
    top: 50%;
    left: 50%;
    right: 0;
    bottom: 0;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px 10px rgba($color: #ffffff, $alpha: 0.15);
    .top{
        position: relative;
        height: 40px;
        .title{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            // background: $green-color;
        }
        .close{
            position: absolute;
            top: 0;
            right: 0;
            width: 50px;
            height: 50px;
            transition: .3s;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #000000;
        }
        .close:hover{
            background: #F56C6CCC;
            color: #FFFFFF;
        }
        .close:hover .icon{
            animation: rotate 0.3s ease-in-out;
        }
    }
}

@keyframes rotate {
    0%{-webkit-transform:rotate(0deg);}
    100%{-webkit-transform:rotate(270deg);}
}

</style>