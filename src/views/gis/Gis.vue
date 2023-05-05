<template>
<div class="m">
    <weather-background :type="weatherBackground"/>
    <!-- <div style="position: fixed;top: 100px; left: 100px;opacity: 0.5; z-index: 9999999">
            <el-button v-for="(item ,i) in ['晴', '阵雨', '小雨', '中雨', '大雨', '暴雨', '大暴雨',
               '冻雨', '阵雪', '小雪', '中雪', '大雪', '雷阵雨', '雾', '霾',
               '浮尘', '扬沙', '强沙尘暴']" :key="i" type="primary" @click="this.weatherBackground=item">{{item}}</el-button>
    </div> -->
    <div class="main">
      <div class="map-box">
        <div id="map"></div>
      </div>
        
    </div>
</div>
</template>

<script>
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import weatherBackground from '@/components/weatherBackground.vue'
import http from '@/axios'
export default {
  components: { weatherBackground },
  data() {
    return{
        weatherBackground: '晴'
    }
  },
  mounted() {
    // create map instance
    const map = L.map('map', {attributionControl: false}).setView([43.8, 125.2], 10);

    //声明街道地图图层
    var osmLayer = L.tileLayer("http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}", {
        attribution: "osm"
    });
    //声明卫星地图图层
    var stamenLayer = L.tileLayer("https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", {
        attribution: "stamen"
    });
    //新建图层控件的数据源-地图
    var baseLayers = {
        '卫星地图': stamenLayer,
        '街道地图': osmLayer
    };

    // add tile layer
    L.tileLayer('https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
      maxZoom: 18
    }).addTo(map);

    //新建图层控件并添加到地图
    L.control.layers(baseLayers).addTo(map);

    // add draw control
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
      edit: {
        // featureGroup: drawnItems
        //绘制图层
        featureGroup:drawnItems,
        //图形编辑控件
        edit:false,
        //图形删除控件
        remove:true,
      },
      draw: {
        //绘制线
        polyline:true,
        //绘制多边形
        polygon:true,
        //绘制矩形
        rectangle:true,
        //绘制圆
        circle:true,
        //绘制标注
        marker:false,
        //绘制圆形标注
        circlemarker:false
      }
    });
    map.addControl(drawControl);

    // add events
    map.on('draw:created', (e) => {
      drawnItems.addLayer(e.layer);
    });
  },
  created(){
    
    // http.post('/', {name: 'bob'}).then(res => {
    //   console.log(res)
    // })
  }
}
</script>

<style lang="scss" scoped>

.main{
    position: relative; 
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    .map-box{
      width: 80vw;
      height: 80vh;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 0 6px 6px rgba($color: #555555, $alpha: .3);
      #map{
        width: 80vw;
        height: 80vh;
      }
   }
}

</style>
<style>
.leaflet-touch .leaflet-control-layers-toggle{
  cursor: pointer;
}
.leaflet-control-layers-list, .leaflet-control-layers label, .leaflet-control-layers input{
  cursor: pointer;
}
</style>