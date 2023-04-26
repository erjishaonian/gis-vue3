<template>
<div>
    <weather-background :type="weatherBackground"/>
    <div class="main">
        GIS
        <div style="position: fixed;top: 200px; left: 300px">
            <el-button v-for="(item ,i) in ['晴', '阵雨', '小雨', '中雨', '大雨', '阵雪', '小雪', '中雪', '大雪', '雷阵雨']" :key="i" type="primary" @click="this.weatherBackground=item">{{item}}</el-button>
        </div>
    </div>
</div>
</template>

<script>
import weatherBackground from '@/components/weatherBackground.vue'
export default {
  components: { weatherBackground },
  data() {
    return{
        weatherBackground: '晴'
    }
  },
  created(){
  }
}
</script>

<style scoped>
.main{
   position: relative; 
}
</style>