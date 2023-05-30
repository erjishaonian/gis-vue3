<template>
  <div class="page">
    
    <div class="index-page" title="">
      <video aria-hidden="true" muted class="video" autoplay loop playsinline playbackRate="0.8">
        <source src="@/assets/video/绿色近景.mp4" type="video/mp4">
        Your browser does not support the video tag. 
      </video>
      <div class="container">
        <div title="title" class="span-bottom-line">{{indexTitle}}</div>
      </div>
      
    </div>
    
    <main class="main" title="">
      <section class="list-item" v-for="(item, i) in decsList" :key="i">
        <div class="item-image">
          <img class="image" :src="item.img||'https://t7.baidu.com/it/u=3691080281,11347921&fm=193&f=GIF'" alt="image">
        </div>
        <div class="item-text  span-bottom-line">
          <div class="text-title">{{item.title}}</div>
          <div class="text-desc">{{item.decs}}</div>
        </div>
      </section>
    </main>

    <!-- 回到顶部 -->
    <el-backtop :right="100" :bottom="200" />

  </div>
</template>

<script>
import '@/assets/untils/span.bottom.line.css'
import {throttle} from '@/assets/untils/untils.js'
import Modal from '@/components/Modal.vue'
export default {
  components: {
    Modal
  },
  data () {
    return {
      indexTitle: '农业gis及综合预警服务平台',
      decsList:[
        {
          title: '「gis地图」',
          decs: '提供即时农田地图，助力精准农业生产',
          img: require('@/assets/img/gis.jpeg')
        },
        {
          title: '「气象预警」',
          decs: '恶劣天气预警，第一时间提醒您防范自然灾害',
          img: require('@/assets/img/fields-1589613.jpg')
        },
        {
          title: '「专家指导」',
          decs: '科学管理农业生产，保障产量与质量',
          img: require('@/assets/img/map-4152197_1920.jpg')
        },
        {
          title: '「数字农业」',
          decs: '数据驱动，提高农业效益，促进农业可持续发展',
          img: require('@/assets/img/system-2660914_1920.jpg')
        },
        {
          title: '「天气预报」',
          decs: '随时随地查看天气预报，农事无忧',
          img: require('@/assets/img/sky-1441936_1920.jpg')
        },
        {
          title: '「携手前行」',
          decs: '让我们一起创造更美好的农业未来',
          img: require('@/assets/img/tree-247122.jpg')
        }
      ]
    }
  },
  methods: {
    imageTrandorm(){
     //窗口高度
      let windowHeight = window.outerHeight
      let halfWindowHeight = windowHeight/2
      let image = document.getElementsByClassName('image')
      for (let index = 0; index < image.length; index++) {
        let element = image[index]
        //元素窗口上边距
        let top = element.getBoundingClientRect().top
        //元素高度
        let elementHeight = element.clientHeight
        //元素偏移量
        let imageTransformY = (halfWindowHeight-(top+elementHeight/2))*100/halfWindowHeight-100
        // element.style.transform = 'translateY(' + imageTransformY +'px)'
        element.style.top = imageTransformY +'px'
      }
    }
  },
  mounted () {
    this.imageTrandorm()
    //节流 xx内执行一次
    window.addEventListener('scroll', throttle(this.imageTrandorm, 10))
  },
  unmounted(){
    // window.removeEventListener('scroll')
  }
}
</script>

<style lang="scss" scoped>
.page{
  width: 100%;
  min-width: 1280px;
  /* height: 100%; */
  .top{
    height: 150px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    transition: all 0.3s ease;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    z-index: 999;
    .image{
      // width: 80px;
      height: 60px;
    }
  }
  .index-page{
    height: 100vh;
    min-height: 720px;
    .container{
      z-index: 20;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.6);
      .span-bottom-line{
        position: absolute;
        top: 60%;
        bottom: 20%;
        left: 10%;
        right: 80%;
        margin: auto;

        color: #eeeeee;
        font-size: 42px;
        background-position-y: 54px;
        height: 60px;
        width: max-content;
        transition:  background-size 0.5s;
        cursor: pointer;
      }
    }
    .video{
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -20;
    }
    
  }
  .main{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .list-item{
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 600px;
      overflow: hidden;
      .item-image{
        position: absolute;
        width: 100%;
        height: 100%;
        // z-index: 1;
        overflow: hidden;
        transition: transform 0.3s;
        background-color: #000000;
        .image{
          display: block;
          width: 100%;
          height: 800px;
          object-fit: cover;
          // transform: translateY(-100px);
          position: absolute;
          top: -100px;
          filter: brightness(60%) blur(2px);
          transition: transform 0.3s ease;
        }
      }
      .item-text{
        color: #eeeeee;
        font-family: '黑体', Courier, monospace;
        text-align: center;
        z-index: 2;
        .text-title{
          font-size: 40px;
          font-weight: bolder;
          margin-bottom: 20px;
        }
        .text-desc{
          font-size: 22px;
        }
      }
    }
    .list-item:hover .item-image .image{
      filter: brightness(90%) blur(0);
    }
    .list-item:hover .item-image{
      transform: scale(1.03);

    }
  }
  .el-backtop{
    background: #000000;
    color: #fff;
  }
}

</style>