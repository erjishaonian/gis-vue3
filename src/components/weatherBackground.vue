<template>
  <div class="weather-background">
    <transition-group name="fade">
        <div v-if="type === '晴'" class="sun-weather-background weather-background-main">
            <div class="weather-background-sun"></div>
        </div>
        <div v-if="type.indexOf('雨')!==-1" class="rain-weather-background weather-background-main">
            <div class="back-row-toggle splat-toggle">
                <div class="rain front-row"></div>
            </div>
        </div>
        <div v-if="type.indexOf('雪')!==-1" class="snow-weather-background weather-background-main">
            <div v-for="i in snowArray[type]" :key="i" class="snow"></div>
        </div>
        <div v-if="type.indexOf('雷')!==-1" class="thunder-weather-background weather-background-main">
            
        </div>
    </transition-group>
  </div>
</template>

<script>
export default {
    props:{
        type:{
            value: String,
            default: '晴'
        }
    },
    watch: {
        type(oldV, newV){
            if(oldV.indexOf('雨')!==-1){
                setTimeout(()=>{
                    this.rain(this.rainArray[oldV])
                },100)
            }
            if(oldV.indexOf('雷')!==-1){
                setTimeout(()=>{
                    this.rain()
                },100)
            }
        }
    },
    data(){
        return{
            rainArray: {
                '阵雨': 1,
                '小雨': 3,
                '中雨': 5,
                '大雨': 7,
                '雷阵雨': 5
            },
            snowArray: {
                '阵雪': 20,
                '小雪': 60,
                '中雪': 100,
                '大雪': 200,
            }
        }
    },
    methods:{
        light(){

        },
        rain(num = 1){
            document.getElementsByClassName('front-row')[0].innerHTML = ''
            let i = 0
            let increment
            let drops = ""
            while(i < num)
            {
                increment = 0
                while (increment < 100) {
                    //couple random numbers to use for various randomizations
                    //random number between 98 and 1
                    var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
                    //random number between 20 and 7
                    var randoFiver = (Math.floor(Math.random() * (20 - 7 + 1) + 2));
                    //increment
                    increment += randoFiver;
                    //add in a new raindrop with various randomizations to certain CSS properties
                    drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
                }
                i++
            }
            document.getElementsByClassName('front-row')[0].innerHTML += drops
        }
    }
}
</script>
<style lang="scss" scoped>
.snow-weather-background{
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
    overflow: hidden;
    filter: drop-shadow(0 0 10px white);
}
@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}

.snow {
  $total: 200;
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;

  @for $i from 1 through $total {
    $random-x: random(1000000) * 0.0001vw;
    $random-offset: random_range(-100000, 100000) * 0.0001vw;
    $random-x-end: $random-x + $random-offset;
    $random-x-end-yoyo: $random-x + ($random-offset / 2);
    $random-yoyo-time: random_range(30000, 80000) / 100000;
    $random-yoyo-y: $random-yoyo-time * 100vh;
    $random-scale: random(10000) * 0.0001;
    $fall-duration: random_range(10, 30) * 1s;
    $fall-delay: random(30) * -1s;

    &:nth-child(#{$i}) {
      opacity: random(10000) * 0.0001;
      transform: translate($random-x, -10px) scale($random-scale);
      animation: fall-#{$i} $fall-duration $fall-delay linear infinite;
    }

    @keyframes fall-#{$i} {
      #{percentage($random-yoyo-time)} {
        transform: translate($random-x-end, $random-yoyo-y) scale($random-scale);
      }

      to {
        transform: translate($random-x-end-yoyo, 100vh) scale($random-scale);
      }
    }
  }
}
</style>
<style lang="scss">
.back-row-toggle .rain.back-row {
  display: block;
}
.back-row-toggle, .rain{
    width: 100%;
    height: 100%;
    position: relative;
}
.drop {
  position: absolute;
  bottom: 100%;
  width: 15px;
  height: 120px;
  pointer-events: none;
  animation: drop 0.5s linear infinite;
}

@keyframes drop {
  0% {
    transform: translateY(0vh);
  }
  75% {
    transform: translateY(110vh);
  }
  100% {
    transform: translateY(110vh);
  }
}

.stem {
  position: absolute;
  width: 2px;
  height: 60%;
  margin-left: 7px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25));
  animation: stem 0.5s linear infinite;
}

@keyframes stem {
  0% {
    opacity: 1;
  }
  65% {
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.splat {
  width: 15px;
  height: 10px;
  border-top: 2px dotted rgba(255, 255, 255, 1);
  border-radius: 50%;
  opacity: 1;
  transform: scale(0);
  animation: splat 0.5s linear infinite;
  display: none;
}

.splat-toggle .splat {
  display: block;
}

@keyframes splat {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  80% {
    opacity: 1;
    transform: scale(0);
  }
  90% {
    opacity: 0.5;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}
.rain-weather-background{
    background-color: rgb(85, 85, 85);
}
</style>
<style lang="scss" scoped>
.sun-weather-background{
    background-color: rgb(60, 127, 205);
    .weather-background-sun{
        position: absolute;
        top: 24%;
        left: 75%;
        width: 0;
        height: 0;
        box-shadow: 0 0 100px 100px rgba($color: #ffffff, $alpha: 1);
        animation: sun-box-shadow 4s infinite ease-in-out alternate,
            sun-xy 7s infinite ease-in-out alternate;
    }
    .weather-background-sun::before{
        content: '';
        width: 1700px;
        height: 1px;
        border-radius: 100%;
        background-image: linear-gradient(to right, 
            rgba($color: #ffffff, $alpha: 0),
            rgba($color: #ffffff, $alpha: 0.1),
            rgba($color: #ffffff, $alpha: 0));
        position: absolute;
        top: 10px;
        left: -850px; 
        transform: rotate(-30deg); 
    }
    @keyframes sun-box-shadow {
        0%{
            box-shadow: 0 0 100px 100px rgba($color: #ffffff, $alpha: 1);
        }
        100%{
            box-shadow: 0 0 140px 140px rgba($color: #ffffff, $alpha: 1);
        }
    }
    @keyframes sun-xy {
        0%{
            top: 24%;
            left: 75%;
        }
        100%{
            top: 29%;
            left: 83%;
        }
    }
}
</style>
<style scoped>
.weather-background{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -10;
}
.weather-background-main{
    width: 100%;
    height: 100%;
    position: relative;
    position: fixed;
}
.fade {
    /*添加过渡效果*/
    transition: opacity 2s;
}
/* 定义进入动画 */
.fade-enter-active { 
    transition: opacity 2s;
}
.fade-enter-from {
    opacity: 0;
}
.fade-enter-to {
    opacity: 1;
}
/* 定义离开动画 */
.fade-leave-active {
    transition: opacity 2s;
}
.fade-leave-to {
    opacity: 0;
}
.fade-leave-from {
    opacity: 1;
}
</style>