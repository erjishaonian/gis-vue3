<template>
  <div class="weather-background">
    <transition-group name="fade">
        <div v-if="type === '晴'" class="sun-weather-background weather-background-main">
            <div class="weather-background-sun"></div>
        </div>
        <div v-if="type.indexOf('雨')!==-1" class="rain-weather-background weather-background-main" 
          :style="(type==='冻雨')?'background-color: rgb(185, 185, 185);':''">
            <div class="back-row-toggle splat-toggle">
                <div class="rain front-row"></div>
            </div>
        </div>
        <div v-if="type.indexOf('雪')!==-1" class="snow-weather-background weather-background-main">
            <div v-for="i in snowArray[type]" :key="i" class="snow"></div>
        </div>
        <div v-if="type.indexOf('雷')!==-1" class="thunder-weather-background weather-background-main">
            <div class="thunder-weather-main"></div>
        </div>
        <div v-if="type==='雾'" class="wu-weather-background weather-background-main">
          <div class="wu-main">
            <div class="wu" v-for="i in 6" :key="i"></div>
          </div>
        </div>
        <div v-if="type==='多云'" class="duoyun-weather-background weather-background-main">
          <div class="duoyun-main">
            <div class="duoyun" v-for="i in 6" :key="i"></div>
          </div>
        </div>
        <div v-if="type==='阴'" class="yin-weather-background weather-background-main">
          <div class="yin-main">
            <div class="yin" v-for="i in 6" :key="i"></div>
          </div>
        </div>
        <div v-if="type==='霾'" class="mai-weather-background weather-background-main">
          <div class="mai-main">
            <div class="mai" v-for="i in 6" :key="i"></div>
          </div>
        </div>
        <div v-if="type==='浮尘'" class="fuchen-weather-background weather-background-main">
          <div class="fuchen-main">
            <div class="fuchen" v-for="i in 6" :key="i"></div>
          </div>
        </div>
        <div v-if="type==='扬沙'" class="yangsha-weather-background weather-background-main">
          <div class="yangsha-main">
            <div class="yangsha" v-for="i in 6" :key="i"></div>
          </div>
        </div>
        <div v-if="type==='强沙尘暴'" class="shachenbao-weather-background weather-background-main">
          <div class="shachenbao-main">
            <div class="shachenbao" v-for="i in 6" :key="i"></div>
          </div>
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
                '小到中雨': 4,
                '中雨': 5,
                '中到到大雨': 6,
                '大雨': 7,
                '大到暴雨': 8,
                '暴雨': 9,
                '暴雨到大暴雨': 10,
                '大暴雨': 11,
                '特大暴雨': 13,
                '雷阵雨': 7,
                '雨夹雪': 7,
                '冻雨': 5,
                '雷阵雨伴有冰雹': 7
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
@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}
.thunder-weather-main{
  // z-index: 2;
  width: 100%;
  height: 100%;
  background: rgba(228, 228, 228, 0.8);
  opacity: 0;
  animation: light 10s infinite alternate;
}
@keyframes light {
  48%{
    opacity: 0;
  }
  50%{
    opacity: 1;
  }
  52%{
    opacity: 0;
  }
}
</style>
<style lang="scss" scoped>
.shachenbao-weather-background{
  background-color: rgba(190, 173, 75, 0.5);
  position: relative;
}
.shachenbao-main{
  width: 100%;
  height: 100%;
  position: relative;
  animation: changeright 60s linear infinite;
}
.shachenbao{
  position: absolute;
  width: 0;
  height: 0;
}
@keyframes changeright{       
  0%{-webkit-transform:rotate(0deg);}
  50%{-webkit-transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);}
}
.shachenbao:nth-child(1){
  top: 60%;
  left: 50%;
  box-shadow: 0 0 500px 500px rgba(211, 179, 73, 0.9);
}
.shachenbao:nth-child(2){
  top: 20%;
  left: 20%;
  box-shadow: 0 0 300px 300px rgba(211, 179, 73, 0.9);
}
.shachenbao:nth-child(3){
  top: 20%;
  left: 80%;
  box-shadow: 0 0 200px 200px rgba(211, 179, 73, 0.9);
}
.shachenbao:nth-child(4){
  top: 100%;
  left: 35%;
  box-shadow: 0 0 140px 140px rgba(211, 179, 73, 0.9);
}
.shachenbao:nth-child(5){
  top: 110%;
  left: 70%;
  box-shadow: 0 0 260px 260px rgba(211, 179, 73, 0.9);
}
.shachenbao:nth-child(6){
  top: 50%;
  left: 5%;
  box-shadow: 0 0 300px 300px rgba(211, 179, 73, 0.9);
}
</style>
<style lang="scss" scoped>
@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}
.yangsha-weather-background{
  background-color: rgb(60, 127, 205);
  position: relative;
}
.yangsha-main{
  width: 100%;
  height: 100%;
  position: relative;
}
.yangsha{
  position: absolute;
  width: 0;
  height: 0;
}
@keyframes right{       
  0%{-webkit-transform:translateX(0);}
  50%{-webkit-transform:translateX(40vw);}
  100%{-webkit-transform:translateX(0);}
}
@keyframes left{       
  0%{-webkit-transform:translateX(0);}
  50%{-webkit-transform:translateX(-40vw);}
  100%{-webkit-transform:translateX(0);}
}
.yangsha:nth-child(1){
  top: 60%;
  left: 50%;
  box-shadow: 0 0 100px 100px rgba(211, 179, 73, 0.5);
  animation: left random_range(30, 60)*1s linear infinite;
}
.yangsha:nth-child(2){
  top: 40%;
  left: 30%;
  box-shadow: 0 0 200px 200px rgba(211, 179, 73, 0.5);
  animation: right random_range(30, 60)*1s linear infinite;
}
.yangsha:nth-child(3){
  top: 20%;
  left: 70%;
  box-shadow: 0 0 100px 100px rgba(211, 179, 73, 0.5);
  animation: left random_range(30, 60)*1s linear infinite;
}
.yangsha:nth-child(4){
  top: 70%;
  left: 35%;
  box-shadow: 0 0 140px 140px rgba(211, 179, 73, 0.5);
  animation: right random_range(30, 60)*1s linear infinite;
}
.yangsha:nth-child(5){
  top: 70%;
  left: 70%;
  box-shadow: 0 0 160px 160px rgba(211, 179, 73, 0.5);
  animation: left random_range(30, 60)*1s linear infinite;
}
.yangsha:nth-child(6){
  top: 50%;
  left: 60%;
  box-shadow: 0 0 100px 100px rgba(211, 179, 73, 0.5);
  animation: right random_range(30, 60)*1s linear infinite;
}
</style>
<style lang="scss" scoped>
@function random_range($min, $max) {
  $rand: random();
  $random_range: $min + floor($rand * (($max - $min) + 1));
  @return $random_range;
}
.fuchen-weather-background{
  background-color: rgb(60, 127, 205);
  position: relative;
}
.fuchen-main{
  width: 100%;
  height: 100%;
  position: relative;
}
.fuchen{
  position: absolute;
  width: 0;
  height: 0;
}
@keyframes right{       
  0%{-webkit-transform:translateX(0);}
  50%{-webkit-transform:translateX(40vw);}
  100%{-webkit-transform:translateX(0);}
}
@keyframes left{       
  0%{-webkit-transform:translateX(0);}
  50%{-webkit-transform:translateX(-40vw);}
  100%{-webkit-transform:translateX(0);}
}
.fuchen:nth-child(1){
  top: 60%;
  left: 50%;
  box-shadow: 0 0 100px 100px rgba(211, 179, 73, 0.3);
  animation: left random_range(30, 60)*1s linear infinite;
}
.fuchen:nth-child(2){
  top: 40%;
  left: 30%;
  box-shadow: 0 0 200px 200px rgba(211, 179, 73, 0.3);
  animation: right random_range(30, 60)*1s linear infinite;
}
.fuchen:nth-child(3){
  top: 20%;
  left: 70%;
  box-shadow: 0 0 100px 100px rgba(211, 179, 73, 0.3);
  animation: left random_range(30, 60)*1s linear infinite;
}
.fuchen:nth-child(4){
  top: 70%;
  left: 35%;
  box-shadow: 0 0 140px 140px rgba(211, 179, 73, 0.3);
  animation: right random_range(30, 60)*1s linear infinite;
}
.fuchen:nth-child(5){
  top: 70%;
  left: 70%;
  box-shadow: 0 0 160px 160px rgba(211, 179, 73, 0.3);
  animation: left random_range(30, 60)*1s linear infinite;
}
.fuchen:nth-child(6){
  top: 50%;
  left: 60%;
  box-shadow: 0 0 100px 100px rgba(211, 179, 73, 0.3);
  animation: right random_range(30, 60)*1s linear infinite;
}
</style>
<style lang="scss" scoped>
.mai-weather-background{
  background-color: rgba(143, 143, 143, 0.8);
  position: relative;
}
.mai-main{
  width: 100%;
  height: 100%;
  position: relative;
  animation: changeright 80s linear infinite;
}
.mai{
  position: absolute;
  width: 0;
  height: 0;
}
@keyframes changeright{       
  0%{-webkit-transform:rotate(0deg);}
  50%{-webkit-transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);}
}
.mai:nth-child(1){
  top: 60%;
  left: 50%;
  box-shadow: 0 0 1000px 1000px rgb(112, 112, 112);
}
.mai:nth-child(2){
  top: 40%;
  left: 30%;
  box-shadow: 0 0 200px 200px rgb(119, 118, 118);
}
.mai:nth-child(3){
  top: 20%;
  left: 70%;
  box-shadow: 0 0 100px 100px rgb(114, 113, 113);
}
.mai:nth-child(4){
  top: 70%;
  left: 35%;
  box-shadow: 0 0 140px 140px rgb(112, 112, 112);
}
.mai:nth-child(5){
  top: 70%;
  left: 70%;
  box-shadow: 0 0 160px 160px rgb(117, 117, 117);
}
.mai:nth-child(6){
  top: 50%;
  left: 60%;
  box-shadow: 0 0 100px 100px rgb(110, 110, 110);
}
</style>
<style lang="scss" scoped>
.wu-weather-background{
  background-color: rgba(170, 170, 170, 0.8);
  position: relative;
}
.wu-main{
  width: 100%;
  height: 100%;
  position: relative;
  animation: changeright 80s linear infinite;
}
.wu{
  position: absolute;
  width: 0;
  height: 0;
}
@keyframes changeright{       
  0%{-webkit-transform:rotate(0deg);}
  50%{-webkit-transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);}
}
.wu:nth-child(1){
  top: 60%;
  left: 50%;
  box-shadow: 0 0 1000px 1000px rgb(160, 160, 160);
}
.wu:nth-child(2){
  top: 40%;
  left: 30%;
  box-shadow: 0 0 200px 200px rgb(163, 163, 163);
}
.wu:nth-child(3){
  top: 20%;
  left: 70%;
  box-shadow: 0 0 100px 100px rgb(167, 167, 167);
}
.wu:nth-child(4){
  top: 70%;
  left: 35%;
  box-shadow: 0 0 140px 140px rgb(170, 170, 170);
}
.wu:nth-child(5){
  top: 70%;
  left: 70%;
  box-shadow: 0 0 160px 160px rgb(175, 175, 175);
}
.wu:nth-child(6){
  top: 50%;
  left: 60%;
  box-shadow: 0 0 100px 100px rgb(161, 161, 161);
}
</style>
<style lang="scss" scoped>
.duoyun-weather-background{
  background-color: rgb(60, 127, 205);
  position: relative;
}
.duoyun-main{
  width: 100%;
  height: 100%;
  position: relative;
  animation: changeright 80s linear infinite;
}
.duoyun{
  position: absolute;
  width: 0;
  height: 0;
}
@keyframes changeright{       
  0%{-webkit-transform:rotate(0deg);}
  50%{-webkit-transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);}
}
.duoyun:nth-child(1){
  top: 60%;
  left: 10%;
  box-shadow: 0 0 300px 300px rgba(250, 250, 250, 0.7);
}
.duoyun:nth-child(2){
  top: 20%;
  left: 50%;
  box-shadow: 0 0 300px 300px rgba(207, 207, 207, 0.7)
}
.duoyun:nth-child(3){
  top: 20%;
  left: 90%;
  box-shadow: 0 0 200px 200px rgba(196, 196, 196, 0.7)
}
.duoyun:nth-child(4){
  top: 70%;
  left: 35%;
  box-shadow: 0 0 140px 140px rgba(207, 207, 207, 0.7)
}
.duoyun:nth-child(5){
  top: 70%;
  left: 70%;
  box-shadow: 0 0 160px 160px rgba(236, 236, 236, 0.7)
}
.duoyun:nth-child(6){
  top: 50%;
  left: 60%;
  box-shadow: 0 0 100px 100px rgba(219, 219, 219, 0.7)
}
</style>
<style lang="scss" scoped>
.yin-weather-background{
  background-color: rgb(60, 127, 205);
  position: relative;
}
.yin-main{
  width: 100%;
  height: 100%;
  position: relative;
  animation: changeright 80s linear infinite;
}
.yin{
  position: absolute;
  width: 0;
  height: 0;
}
@keyframes changeright{       
  0%{-webkit-transform:rotate(0deg);}
  50%{-webkit-transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);}
}
.yin:nth-child(1){
  top: 60%;
  left: 30%;
  box-shadow: 0 0 700px 700px rgba(151, 151, 151, 0.7);
}
.yin:nth-child(2){
  top: 40%;
  left: 30%;
  box-shadow: 0 0 400px 400px rgba(153, 153, 153, 0.7)
}
.yin:nth-child(3){
  top: 20%;
  left: 90%;
  box-shadow: 0 0 400px 300px rgba(133, 133, 133, 0.7)
}
.yin:nth-child(4){
  top: 70%;
  left: 35%;
  box-shadow: 0 0 240px 240px rgba(114, 114, 114, 0.7)
}
.yin:nth-child(5){
  top: 70%;
  left: 70%;
  box-shadow: 0 0 260px 260px rgba(146, 146, 146, 0.7)
}
.yin:nth-child(6){
  top: 50%;
  left: 60%;
  box-shadow: 0 0 200px 200px rgba(148, 148, 148, 0.7)
}
</style>
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
        box-shadow: 0 0 100px 100px rgba($color: #fdf6b3, $alpha: 1);
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
            box-shadow: 0 0 100px 100px rgba($color: #fffbd3, $alpha: 1);
        }
        100%{
            box-shadow: 0 0 140px 140px rgba($color: #f8f7ee, $alpha: 1);
        }
    }
    @keyframes sun-xy {
        0%{
            top: 14%;
            left: 80%;
        }
        100%{
            top: 19%;
            left: 90%;
        }
    }
}
</style>
<style scoped>
.weather-background{
    background-color: black;
    position: fixed;
    width: 100%;
    height: 100%;
    /* z-index: -10; */
    pointer-events: none;
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