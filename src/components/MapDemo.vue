<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

export default {
  mounted() {
    // create map instance
    const map = L.map('map').setView([43.8, 125.2], 10);

    // add tile layer
    L.tileLayer('http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
      maxZoom: 18
    }).addTo(map);

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
  }
};
</script>
<style lang="scss" scoped>
#map{
  width: 1414px;
  height: 1040px;
}
// // Leaflet tile layer style
// .leaflet-tile {
//   border: none;
// }

// // Leaflet draw control style
// .leaflet-draw-toolbar {
//   position: absolute;
//   top: 10px;
//   left: 50px;
//   z-index: 2000;
// }

// // Leaflet draw control button style
// .leaflet-draw-toolbar a {
//   background-color: #fff;
//   border: 2px solid #333;
//   color: #333;
//   display: block;
//   font-size: 16px;
//   line-height: 1.4;
//   padding: 8px 12px;
//   text-align: center;
//   text-decoration: none;
// }

// .leaflet-draw-toolbar a:hover,
// .leaflet-draw-toolbar a:active,
// .leaflet-draw-toolbar a.active {
//   background-color: #333;
//   color: #fff;
// }

</style>
