<template>
  <div class="button-main"
    :style="{
        color: specialStyle.color || Fcolor,
        borderColor: specialStyle.borderColor || borderColor,
        background: specialStyle.background || background,
        animation: buttonAnimation,
        padding: padding,
        fontSize: fontSize + 'px',
        borderRadius: borderRadius + 'px',
        width: width,
        boxShadow: specialBoxShadow
    }"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mouseover="mouseover"
    @mouseout="mouseout"
  >
    <slot/>
  </div>
</template>

<script>
export default {
    name: 'Button',
    props: {
        type: {
            value: String,
            default: 'normal'
        },
        Fcolor: {
            value: String,
            default: null
        },
        borderColor: {
            value: String,
            default: null
        },
        background: {
            value: String,
            default: null
        },
        padding: {
            value: String,
            default: '8px 16px'
        },
        fontSize: {
            value: Number,
            default: 16
        },
        borderRadius: {
            value: Number,
            default: 4
        },
        width: {
            value: String,
            default: 'fit-content'
        },
        special: {
            value: Object,
            default: {
                line: false,
                color: null
            }
        },
    },
    data() {
        return{
            specialStyle: {
                color: null,
                borderColor: null,
                background: null,
                boxShadow: null
            },
            specialBoxShadow: null,
            mouseIn: false,
            color: null,
            line: false,
            buttonAnimation: '',
            styleKey: {
                'normal': {
                    color: '#555555',
                    line: true
                },
                'main': {
                    color: '#42b983',
                    line: false
                },
                'info': {
                    color: '#909399',
                    line: false
                },
                'error': {
                    color: '#F56C6C',
                    line: false
                },
                'success': {
                    color: '#67C23A',
                    line: false
                },
                'warining': {
                    color: '#E6A23C',
                    line: false
                },
                'primary': {
                    color: '#0077ff',
                    line: false
                }
            }
        }
    },
    methods: {
        mouseover(){
            this.mouseIn = true
            if(this.specialStyle.color){
                this.specialBoxShadow = '0 0 8px ' + this.color + '5b'
                if(this.line){
                    this.specialStyle = {
                        color: this.color,
                        borderColor: this.color,
                        background: this.color + '11',
                    }
                }
                else{
                    this.specialStyle = {
                        color: '#ffffff',
                        borderColor: this.color,
                        background: this.color + 'd8',
                    }
                }
            }
        },
        mouseout(){
            this.mouseIn = false
            this.specialInit()
                this.specialBoxShadow = null
        },
        mousedown(){
            if(this.specialStyle.color){
                if(this.line){
                    this.specialStyle = {
                        color: this.color,
                        borderColor: this.color,
                        background: this.color + '22',
                    }
                }
                else{
                    let c = this.LightDarkenColor(this.color, -20)
                    this.specialStyle = {
                        color: '#ffffff',
                        borderColor: c,
                        background: c,
                    }
                }
            }
        },
        mouseup(){
            if(this.mouseIn){
                this.mouseover()
                this.buttonAnimation = 'button-click-2026544 .3s'
                setTimeout(() => {
                    this.buttonAnimation = null
                }, 300);
                return
            }
            this.specialInit()
        },
        specialInit(){
            if(this.line){
                this.specialStyle = {
                    color: this.color,
                    borderColor: this.color,
                    background: 'transparent',
                }
            }
            else{
                this.specialStyle = {
                    color: '#ffffff',
                    borderColor: this.color,
                    background: this.color,
                }
            }
        },
        getRgbNum(sColor){
            if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){  //补全颜色值 例如：#eee,#fff等
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
            }
            //处理六位颜色值
            var sColorChange = [];
            for(var i=1; i<7; i+=2){
            //核心代码，通过parseInt将十六进制转为十进制，parseInt只有一个参数时是默认转为十进制的，第二个参数则是指定转为对应进制
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            }
            return sColorChange;
        },
        LightDarkenColor(color, num) {
            let colorArr = this.getRgbNum(color);
            let sColorChange = [];
            for(var i=0;i<colorArr.length;i++){
                    let  val = colorArr[i]+num;
                    if(val<0){
                    val = 0;
                    }
                    if(val>255){
                        val=255;
                    }
                    sColorChange.push(val)
            }
            return "rgba(" + sColorChange.join(",") + ",1)";
        }
    },
    created(){
        if(this.special.color){
            this.color = this.special.color
            this.line = this.special.line
        }
        else if(this.type && this.styleKey[`${this.type}`]){
            this.line = this.special.line ||this.styleKey[`${this.type}`].line
            this.color = this.styleKey[`${this.type}`].color
        }
        else{
            this.line = true
            this.color = '#555555'
        }
        this.specialInit()
    },
    watch:{
        special(oldV, newV){
            this.color = newV.color
            this.line = newV.line
            this.specialInit()
        }
    }
}
</script>

<style scoped>
.button-main{
    display: flex;
    border-width: 1px;
    border-style: solid;
    justify-content: center;
    cursor: pointer;
    /* transition: .1s; */

    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
}

</style>
<style>
@keyframes button-click-2026544 {
  20% {
    transform: scale(0.95);
  }
}
</style>