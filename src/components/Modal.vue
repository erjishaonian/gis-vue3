<template>
    <Transition name="modal">
        <div class="bk" v-show="show" @click="close">
            <div class="main" @click.stop="" v-show="show" >
                <div class="top">
                    <div class="title">
                        Title
                    </div>
                    <div class="close" @click="close">
                        <el-icon class="icon" :size="20"><Close /></el-icon>
                    </div>
                </div>
                <slot style="flex: 1"></slot>
                <div class="buttom">
                    bottom
                </div>
            </div>
        </div>
    </Transition>
    
</template>

<script>
export default {
    props: {
        show: {
            value: Boolean,
            default: false
        }
    },
    created () {
        console.log('modal created')
    },
    methods: {
        close(){
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
    z-index: 99999;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba($color: #000000, $alpha: 0.7);
    .main{
        background-color: rgba($color: #888888, $alpha: 0.8);
        min-height: 300px;
        min-width: 500px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 1px 1px rgba($color: #888888, $alpha: 0.8);
        .top{
            position: relative;
            height: 40px;
            .title{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .close{
                position: absolute;
                top: 0;
                right: 0;
                width: 40px;
                height: 40px;
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
}
@keyframes rotate {
    0%{-webkit-transform:rotate(0deg);}
    100%{-webkit-transform:rotate(270deg);}
}
</style>