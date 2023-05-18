<template>
  <div class="m">
    <weather-background :type="weatherMain" />
    <!-- <div style="position: fixed;top: 100px; left: 100px;opacity: 0.5; z-index: 9999999">
            <el-button v-for="(item ,i) in ['晴', '阵雨', '小雨', '中雨', '大雨', '暴雨', '大暴雨',
               '冻雨', '阵雪', '小雪', '中雪', '大雪', '雷阵雨', '雾', '霾',
               '浮尘', '扬沙', '强沙尘暴', '多云', '阴']" :key="i" type="primary" @click="this.weatherMain=item">{{item}}</el-button>
    </div> -->
    <div class="main">
      <div class="left">
        <CitySelect
          @change="citySelectChange"
          :city="this.citySelectValue.city"
          :district="this.citySelectValue.district"
        ></CitySelect>
        <div class="weather">
          <div class="row row-1">
            <div class="icon">
              <img
                :src="
                  require('@/assets/img/weather-icon/' + weatherMain + '.png')
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div class="map-box" id="map-box">
        <div id="map">
          <div class="map-container">
            <div class="button sub" @click="openSubmit">农田申报</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import weatherBackground from "@/components/weatherBackground.vue";
import CitySelect from "@/components/CitySelect.vue";
import http from "@/axios";
export default {
  components: { weatherBackground, CitySelect },
  data() {
    return {
      weatherMain: "晴",
      map: null,
      fullScreenFlag: false,
      citySelectValue: null,
      userInfo: null,
    };
  },
  methods: {
    openSubmit() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user === null) {
        this.$message.error("请先登录！");
      }
      http.post("/", "user.getUserInfo", user).then((res) => {
        if (res.data.real_name) {
          this.$router.push({ path: "/gisadd", query: this.citySelectValue });
        } else {
          this.$message.error("请先点击左上角，进入个人中心，填写真实姓名！");
        }
      });
    },
    clearMap() {
      this.map.eachLayer(function (layer) {
        if (!layer._container) {
          layer.remove();
        }
      });
    },
    mapTo(point) {
      // console.log(point)
      this.map.setView(point.reverse(), 11);
    },
    addGeoJsonToMap(
      json,
      data = {
        color: "#522",
        weight: 2,
        opacity: 1,
        fillColor: "transparent",
        fillOpacity: 0,
      }
    ) {
      let dom = L.geoJson(json, data).addTo(this.map);
    },
    getGeojson(data) {
      this.clearMap();
      http.post("/", "map.getMap", data).then((res) => {
        // console.log(res);
        this.addGeoJsonToMap(res.data);
        if (res.data.features[0].properties.centroid)
          this.mapTo(res.data.features[0].properties.centroid);
        else {
          this.mapTo(res.data.features[0].properties.center);
        }
      });
    },
    citySelectChange(e) {
      this.citySelectValue = e;
      this.getGeojson(e);
    },
    load() {
      let user = JSON.parse(localStorage.getItem("user"));

      this.citySelectValue = {
        city: "吉林",
        district: "船营",
        id: "2679",
        province: "吉林",
      };
      http.post("/", "user.getUserInfo", user).then((res) => {
        this.userInfo = res.data;
        if (!this.userInfo.district) {
          return;
        }
        this.citySelectValue = {
          city: this.userInfo.city,
          district: this.userInfo.district,
          province: this.userInfo.province,
        };
      });
    },
  },
  mounted() {
    // create map instance
    const map = L.map("map", { attributionControl: false }).setView(
      [43.8, 125.2],
      10
    );
    this.map = map;

    let mapLayerList = [
      {
        name: "高德卫星地图",
        tms: "http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
      },
      {
        name: "高德街道地图",
        tms: "http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      },
      {
        name: "谷歌午夜蓝",
        tms: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      },
    ];
    let baseLayers = {};
    for (let i = 0; i < mapLayerList.length; i++) {
      baseLayers[mapLayerList[i].name] = L.tileLayer(mapLayerList[i].tms, {
        maxZoom: 15,
      });
    }

    // add tile layer
    L.tileLayer(mapLayerList[0].tms, { maxZoom: 15 }).addTo(map);

    //新建图层控件并添加到地图
    L.control.layers(baseLayers).addTo(map);

    // add draw control
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
      edit: {
        // featureGroup: drawnItems
        //绘制图层
        featureGroup: drawnItems,
        //图形编辑控件
        edit: false,
        //图形删除控件
        remove: true,
      },
      draw: {
        //绘制线
        polyline: true,
        //绘制多边形
        polygon: true,
        //绘制矩形
        rectangle: true,
        //绘制圆
        circle: true,
        //绘制标注
        marker: false,
        //绘制圆形标注
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    // add events
    map.on("draw:created", (e) => {
      drawnItems.addLayer(e.layer);
    });

    this.getGeojson(this.citySelectValue);
  },
  created() {
    this.load();
  },
};
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  display: flex;
  // align-items: center;
  // justify-content: center;
  padding-top: 95px;
  width: auto;
  min-width: 1600px;
  padding-left: 40px;
  padding-right: 40px;
  gap: 45px;
  .left {
    flex: 1;
    height: 85vh;
    gap: 30px;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    transition: 0.5s;
    .button-group {
      width: 100%;
      background: #bbbbbb88;
      border-radius: 10px;
      box-shadow: 0 0 10px 10px rgba($color: #555555, $alpha: 0.3);
      height: 50px;
      display: flex;
      align-items: center;
      .button-item {
        flex: 1;
        text-align: center;
        font-size: 1.15rem;
        line-height: 50px;
        cursor: pointer;
        transition: 0.5s;
      }
      .button-item:hover {
        background: #66666688;
      }
      .line {
        flex: none;
        width: 2px;
        background: #bbbbbb;
        height: 32px;
      }
    }
    .weather {
      width: 100%;
      background: #bbbbbb88;
      border-radius: 10px;
      box-shadow: 0 0 10px 10px rgba($color: #555555, $alpha: 0.3);
      backdrop-filter: blur(3px);
      flex: 1;
      .row {
        display: flex;
        padding: 20px 20px;
      }
      .row-1 {
        .icon {
          background: #ffffffbb;
          padding: 10px;
          border-radius: 35px;
          box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
          img {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
  }
  .map-box {
    width: 72vw;
    min-width: 1100px;
    height: 85vh;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px 10px rgba($color: #555555, $alpha: 0.3);
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out,
      height 0.3s ease-in-out;
    #map {
      width: 72vw;
      min-width: 1100px;
      height: 85vh;
      .map-container {
        position: absolute;
        bottom: 10px;
        z-index: 999;
        display: flex;
        flex-direction: row;
        gap: 10px;
        right: 10px;
        width: fit-content;
        .button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          height: 34px;
          line-height: 44px;
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
        .sub {
          font-size: 18px;
          padding: 0 14px;
        }
      }
    }
  }
}
</style>
<style>
.leaflet-touch .leaflet-control-layers-toggle {
  cursor: pointer;
}
.leaflet-control-layers-list,
.leaflet-control-layers label,
.leaflet-control-layers input {
  cursor: pointer;
}
.leaflet-control-layers,
.leaflet-control-zoom,
.leaflet-draw-section,
.map-container .button {
  border-radius: 5px;
  background: #ffffff88;
  box-shadow: 0 0 10px 10px rgba(85, 85, 85, 0.3);
  backdrop-filter: blur(1px);
  cursor: pointer;
}
.leaflet-bar a {
  background-color: transparent !important;
}
</style>