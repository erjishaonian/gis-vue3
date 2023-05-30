<template>
  <div class="m">
    <weather-background :type="weatherMain" />
    <div class="main">
      <div class="left">
        <CitySelect
          @change="citySelectChange"
          :city="this.citySelectValue.city"
          :district="this.citySelectValue.district"
        ></CitySelect>
        <div class="weather">
          <div class="row row-1">
            <div class="icon box-click" @click="toWeather">
              <div class="icon-row">
                <img
                  :src="
                    require('@/assets/img/weather-icon/' +
                      weatherMain.replace(/^.+转/, '') +
                      '.png')
                  "
                />
                <div class="content">
                  <div class="temperature" v-if="weather.realtime.temperature">
                    {{ weather.realtime.temperature }}°C
                  </div>
                  <div class="info">
                    {{ weatherMain }}
                  </div>
                </div>
              </div>
              <div class="icon-row icon-row2">
                <BellFilled
                  style="width: 22px; height: 22px; color: #000"
                ></BellFilled>
                <div v-if="disaster.result !== null">
                  {{ disaster.result[0].type
                  }}{{ disaster.result[0].level }}预警
                </div>
                <div v-else class="none">暂没有预警信息</div>
              </div>
            </div>
            <div class="right-content">
              <div class="temperature">
                {{ String(weather.future[0].temperature).replace("/", " ~ ") }}
              </div>
              <div class="direct">
                {{ weather.realtime.direct }}
              </div>
              <div class="humidity">风力：{{ weather.realtime.power }}</div>
              <div class="humidity">湿度：{{ weather.realtime.humidity }}%</div>
            </div>
          </div>
          <Transition name="fadeup">
            <div class="row row-2" v-show="farmShow">
              <div class="title">
                <div class="line"></div>
                <div>农户信息</div>
                <div class="line"></div>
              </div>
              <div class="r1">
                <div class="img">
                  <img v-if="farm.img" :src="farm.img" />
                  <img
                    v-else
                    src="@/assets/img/farm.png"
                    style="height: 70px; width: 70px; margin: 10px"
                  />
                </div>
                <div class="content">
                  <div class="name">昵称：{{ farm.username || "姓名" }}</div>
                  <div class="email">邮箱：{{ farm.email || "邮箱" }}</div>
                </div>
              </div>
              <div class="r2">
                <div class="name">
                  个人简介：{{ farm.introduce || "未填写" }}
                </div>
              </div>
              <div class="r3">
                <div class="name">
                  真实姓名：{{ farm.hide === 0 ? farm.real_name : "保密" }}
                </div>
                <div class="name">
                  联系电话：{{
                    farm.hide === 0 ? farm.phone || "未填写" : "保密"
                  }}
                </div>
                <div class="name">
                  微信 号：{{ farm.hide === 0 ? farm.wx || "未填写" : "保密" }}
                </div>
                <div class="name">
                  QQ 号：{{ farm.hide === 0 ? farm.qq || "未填写" : "保密" }}
                </div>
                <div class="name">
                  居住地址：{{
                    farm.hide === 0 ? farm.address || "未填写" : "保密"
                  }}
                </div>
              </div>
              <div class="r4">
                <div class="empty"></div>
                <Button
                  type="main"
                  :width="'100px'"
                  @click="openFarmChat(farm.email)"
                  >联系我</Button
                >
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div class="map-box" id="map-box">
        <div id="map">
          <div class="map-container">
            <div class="button sub" @click="openSubmit">农田申报</div>
          </div>
          <Transition name="fadedown">
            <div class="farm-info" v-show="farmShow">
              <div>农田名称：{{ farm.farmName }}</div>
              <div>种植作物：{{ farm.plant }}</div>
              <div>农田面积：{{ farm.area }}</div>
              <div>农田介绍：{{ farm.farmIntroduce }}</div>
            </div>
          </Transition>
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
import Button from "@/components/Button.vue";
export default {
  components: { weatherBackground, CitySelect, Button },
  data() {
    return {
      weatherMain: "晴",
      map: null,
      fullScreenFlag: false,
      citySelectValue: null,
      userInfo: null,
      weather: {
        city: "吉林",
        realtime: {
          temperature: "19",
          humidity: "39",
          info: "晴",
          wid: "00",
          direct: "南风",
          power: "3级",
          aqi: "20",
        },
        future: [
          {
            date: "2023-05-18",
            temperature: "9/23℃",
            weather: "晴",
            wid: {
              day: "00",
              night: "00",
            },
            direct: "东南风转东北风",
          },
          {
            date: "2023-05-19",
            temperature: "12/23℃",
            weather: "多云转小雨",
            wid: {
              day: "01",
              night: "07",
            },
            direct: "东风转西南风",
          },
          {
            date: "2023-05-20",
            temperature: "12/20℃",
            weather: "多云",
            wid: {
              day: "01",
              night: "01",
            },
            direct: "西南风",
          },
          {
            date: "2023-05-21",
            temperature: "9/19℃",
            weather: "多云",
            wid: {
              day: "01",
              night: "01",
            },
            direct: "西北风",
          },
          {
            date: "2023-05-22",
            temperature: "12/22℃",
            weather: "多云",
            wid: {
              day: "01",
              night: "01",
            },
            direct: "西北风转南风",
          },
        ],
      },
      farm: {},
      farmShow: false,
      disaster: { reason: "success", result: null, error_code: 0 },
      farmClickFlag: false,
    };
  },
  methods: {
    openFarmChat(email) {
      this.$emit("chat", email);
    },
    getFarm() {
      http.post("/", "farm.getZC", this.citySelectValue).then((res) => {
        // console.log(res.data)

        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          let dom = this.addGeoJsonToMap(
            data[i].geojson,
            {
              color: data[i].color,
              weight: parseFloat(data[i].weight),
              opacity: parseFloat(data[i].opacity),
              fillColor: data[i].fill_color,
              fillOpacity: parseFloat(data[i].fill_opacity),
            },
            `农田名称：` +
              data[i].farmName +
              `<br><br>种植作物：` +
              data[i].plant +
              `<br><br>农田面积：` +
              data[i].area +
              `<br><br>农田介绍：` +
              data[i].farmIntroduce +
              ``,
            () => {
              this.farm = data[i];
              this.farmShow = true;
              console.log("click farm");
            }
          );
        }
      });
    },
    getWeather() {
      this.time = new Date().toLocaleTimeString("en-US", { hour12: false });
      http.post("/", "weather.getWeather", this.citySelectValue).then((res) => {
        let data = res.data.result;
        // console.log(res.data);
        this.weather = data;
        this.weatherMain = data.realtime.info;
      });
    },
    getDisaster() {
      http
        .post("/", "disaster.getDisaster", this.citySelectValue)
        .then((res) => {
          // console.log(res)
          this.disaster = res.data;
        });
    },
    toWeather() {
      this.$router.push({ path: "/weather", query: this.citySelectValue });
    },
    openSubmit() {
      let user = JSON.parse(localStorage.getItem("user-info"));
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
      this.map.setView([point[1], point[0]], 11);
    },
    addGeoJsonToMap(
      json,
      data = {
        color: "#522",
        weight: 2,
        opacity: 1,
        fillColor: "transparent",
        fillOpacity: 0,
      },
      popHtml = null,
      func = null
    ) {
      let dom = L.geoJson(json, data).addTo(this.map);
      if (popHtml) {
        // console.log(popHtml);
        // dom.bindPopup(popHtml, {
        //   autoClose: false,
        // });
      }
      if (func) {
        dom.on("click", (e) => {
          this.farmClickFlag = true;
          func();
          // dom.bindPopup(
          //   popHtml +
          //     "<br><br>" +
          //     "经度:" +
          //     e.latlng.lat.toFixed(2).toString() +
          //     "&nbsp&nbsp维度:" +
          //     e.latlng.lng.toFixed(2).toString()
          // );
        });
      }
      return dom;
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
      this.getWeather();
      this.getDisaster();
      this.getGeojson(e);
      this.getFarm();
    },
    load() {
      let user = JSON.parse(localStorage.getItem("user-info"));

      this.citySelectValue = {
        city: "吉林",
        district: "船营",
        id: "2679",
        province: "吉林",
      };
      if (user && user.email) {
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
      }

      this.getWeather();
      this.getDisaster();
    },
  },
  mounted() {
    // create map instance
    const map = L.map("map", {
      attributionControl: false,
      doubleClickZoom: false,
    }).setView([43.8, 125.2], 10);
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
    map.on("click", (e) => {
      // console.log(this.farmClickFlag)
      if (!this.farmClickFlag) this.farmShow = false;
      this.farmClickFlag = false;
      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          "经度:" +
            e.latlng.lat.toFixed(2).toString() +
            "  维度:" +
            e.latlng.lng.toFixed(2).toString()
        )
        .openOn(map);
    });
    map.on("zoomstart ", (e) => {
      map.closePopup();
    });
    map.on("move ", (e) => {});
    this.getGeojson(this.citySelectValue);
    this.getFarm();
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
        .icon {
          .icon-row {
            display: flex;
            gap: 15px;
          }
          .icon-row2 {
            align-items: center;
            justify-content: center;
            .none {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          background: #ffffffbb;
          padding: 20px;
          border-radius: 35px;
          box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
          display: flex;
          flex-direction: column;
          gap: 15px;
          color: #333;
          transition: 0.3s;
          img {
            width: 80px;
            height: 80px;
          }
          .content {
            // padding: 5px;
            .temperature {
              font-size: 34px;
              line-height: 46px;
              font-weight: 900;
            }
            .info {
              line-height: 35px;
              font-size: 20px;
            }
          }
        }
        .right-content {
          padding: 15px 0 15px 30px;
          font-size: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      }
      .row-2 {
        padding-top: 10px;
        display: flex;
        gap: 20px;
        flex-direction: column;
        .title {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 5px;
          .line {
            flex: 1;
            height: 1px;
            background: #ffffff;
          }
        }
        .r1 {
          margin-top: 20px;
          gap: 20px;
          display: flex;
          .img {
            overflow: hidden;
            border-radius: 100%;
            width: 90px;
            height: 90px;
            background: #ffffffbb;
            box-shadow: 0 0 5px 5px rgba($color: #8d8b8b7c, $alpha: 0.3);
            cursor: pointer;
            img {
              height: 90px;
              width: 90px;
              transition: 0.5s;
            }
          }
          .img:hover img {
            transform: scale(1.07);
          }
          .img:hover {
            box-shadow: 0 0 5px 5px rgba($color: #8d8b8b7c, $alpha: 0.1);
          }
          .content {
            flex: 1;
            padding: 13px 0;

            .name {
              width: 250px;
              font-size: 22px;
              font-weight: 500;
              height: 34px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .email {
              margin-top: 10px;
              width: 250px;
              font-size: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .r3 {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .r4 {
          display: flex;
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
      .farm-info {
        border: 2px solid rgba(0, 0, 0, 0.2);
        font-size: 16px;
        position: absolute;
        max-width: 300px;
        bottom: 10px;
        left: 10px;
        z-index: 999;
        padding: 10px;
      }
    }
  }
}
.box-click {
  cursor: pointer;
}
.box-click:hover {
  transform: scale(1.01);
}
.box-click:active {
  animation: box-click 1s;
}
@keyframes box-click {
  10% {
    transform: scale(0.98);
  }
  40% {
    transform: scale(0.98);
  }
  60% {
    transform: scale(1.02);
  }
  80% {
    transform: scale(0.99);
  }
  90% {
    transform: scale(1.01);
  }
}
.empty {
  flex: 1;
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
.map-container .button,
.farm-info {
  border-radius: 5px;
  background: #ffffff88;
  box-shadow: 0 0 10px 10px rgba(85, 85, 85, 0.3);
  backdrop-filter: blur(1px);
  cursor: pointer;
}
.leaflet-bar a {
  background-color: transparent !important;
}
/* 定义进入动画 */
.fadedown-enter-active {
  animation: fadeInUp 0.5s;
}
/* 定义离开动画 */
.fadedown-leave-active {
  animation: fadeOutDown 0.5s;
}
/* 定义进入动画 */
.fadeup-enter-active {
  animation: zoomIn 0.5s;
}
/* 定义离开动画 */
.fadeup-leave-active {
  animation: zoomOut 0.5s;
}
</style>