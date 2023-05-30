<template>
  <div class="container">
    <div class="left box">
      <div
        class="label"
        :class="{ 'label-check': labelCheckIndex === 0 }"
        @click="changeLabel(0)"
      >
        农田审批
      </div>
      <div class="line"></div>
      <div
        class="label"
        :class="{ 'label-check': labelCheckIndex === 1 }"
        @click="changeLabel(1)"
      >
        专家认证审批
      </div>
    </div>
    <div class="right box">
      <div v-show="labelCheckIndex === 0" class="farm right-content">
        <div v-for="(item, i) in farmList" :key="i" class="item">
          <div class="row-1">
            <img v-if="item.img" :src="item.img" class="user-img" />
            <img v-else src="@/assets/img/farm.png" class="user-img" />
            <div class="colum colum-1">
              <div class="real-name">真实姓名：{{ item.real_name }}</div>
              <div class="username">昵称：{{ item.username }}</div>
            </div>
            <div class="colum colum-2">
              <div class="email">
                {{ item.email }}
              </div>
              <div class="school">{{ item.role }}</div>
            </div>
          </div>
          <div class="row-3">
            <div>
              省-市-区：{{ item.province }} - {{ item.city }} -
              {{ item.district }}
            </div>
            <div>农田名称：{{ item.farmName }}</div>
            <div>种植作物：{{ item.plant }}</div>
            <div>农田面积：{{ item.area }}</div>
            <div>农田介绍：{{ item.farmIntroduce }}</div>
          </div>
          <div class="row-5">
            <div class="img" @click="farmModalShowOpen(item)">
              <img src="@/assets/img/map.png" />
              <div>在地图上查看</div>
            </div>
            <div class="button-group">
              <div class="status">{{ item.farmStatus }}</div>
              <Button
                v-if="item.farmStatus === '待审核'"
                :borderRadius="10"
                type="main"
                :width="'120px'"
                @click="submitFarm(item.farmId, item.farmStatus)"
                :padding="'10px 0'"
                >{{ farmButtonLabel[item.farmStatus] }}</Button
              >
            </div>
          </div>
        </div>
      </div>
      <div v-show="labelCheckIndex === 1" class="expert right-content">
        <div v-for="(item, i) in expertList" :key="i" class="item">
          <div class="row-1">
            <img v-if="item.img" :src="item.img" class="user-img" />
            <img v-else src="@/assets/img/farm.png" class="user-img" />
            <div class="colum colum-1">
              <div class="real-name">真实姓名：{{ item.real_name }}</div>
              <div class="username">昵称：{{ item.username }}</div>
            </div>
            <div class="colum colum-2">
              <div class="tips">
                <div
                  v-for="(item, i) in String(item.expertTip).split('-')"
                  :key="i"
                  class="tip"
                >
                  {{ item }}
                </div>
              </div>
              <div class="school">{{ item.school }}-{{ item.education }}</div>
            </div>
          </div>
          <div class="row-3">专家介绍：{{ item.expertIntroduce }}</div>
          <div class="row-4">补充说明：{{ item.content || "无" }}</div>
          <div class="row-5">
            <img
              @click="imgModalShowOpen(item.experImg)"
              :src="item.experImg"
            />
            <div class="button-group">
              <div class="status">{{ item.expertStatus }}</div>
              <Button
                v-if="item.expertStatus === '待审核'"
                :borderRadius="10"
                type="main"
                :width="'120px'"
                @click="submitExpert(item.email, item.expertStatus)"
                :padding="'10px 0'"
                >{{ expertButtonLabel[item.expertStatus] }}</Button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal :show="imgModalShow" title="图片查看" @close="imgModalShowClose">
      <img style="width: 96%; padding: 2%" :src="imgModalSrc" />
    </Modal>
    <Modal :show="farmMapShow" title="农田地图" @close="farmModalShowClose">
      <div class="map-box">
        <div id="map"></div>
        <div v-show="mapLoading" class="loading">
          <div class="loading-container">
            <div class="loading-item item-1"></div>
            <div class="loading-item item-2"></div>
            <div class="loading-item item-3"></div>
            <div class="loading-item item-4"></div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import http from "@/axios";
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";
export default {
  components: { Modal, Button },
  data() {
    return {
      labelCheckIndex: 0,
      farmList: [],
      farmMapShow: false,
      expertList: [],
      imgModalShow: false,
      mapLoading: true,
      imgModalSrc: "#",
      farmButtonLabel: {
        待审核: "通过",
        正常: "冻结",
      },
      expertButtonLabel: {
        待审核: "通过",
        正常: "冻结",
      },
      map: null,
    };
  },
  methods: {
    getFarm(pcd) {
      http.post("/", "farm.getZC", pcd).then((res) => {
        let data = res.data;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          this.addGeoJsonToMap(data[i].geojson, {
            color: data[i].color,
            weight: parseFloat(data[i].weight),
            opacity: parseFloat(data[i].opacity),
            fillColor: data[i].fill_color,
            fillOpacity: parseFloat(data[i].fill_opacity),
          });
        }
      });
    },
    changeLabel(index) {
      this.labelCheckIndex = index;
      this.load();
    },
    submitFarm(id, status) {
      if (status === "待审核") {
        http
          .post("/", "farm.pass", { id: id })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success("审核成功！");
              this.load();
            } else {
              throw new Error();
            }
          })
          .catch((e) => {
            console.log(e);
            this.$message.error("审核失败！");
          });
      }
    },
    submitExpert(email, status) {
      if (status === "待审核") {
        // console.log(status)
        http
          .post("/", "expert.pass", { email: email })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success("审核成功！");
              this.load();
            } else {
              throw new Error();
            }
          })
          .catch((e) => {
            console.log(e);
            this.$message.error("审核失败！");
          });
      }
      // if(status === '正常'){
      //   http.post('/', 'expert.freeze', {email: email}).then(res => {
      //     if (res.status === 200) {
      //       this.$message.success("冻结成功！");
      //       this.load()
      //     } else {
      //       throw new Error();
      //     }
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //     this.$message.error("冻结失败！");
      //   });
      // }
    },
    imgModalShowOpen(src) {
      this.imgModalSrc = src;
      this.imgModalShow = true;
    },
    imgModalShowClose() {
      this.imgModalShow = false;
    },
    farmModalShowOpen(data) {
      this.mapLoading = true;
      this.farmMapShow = true;
      setTimeout(() => {
        this.mapInit(data);
        this.mapLoading = false;
      }, 1500);
    },
    farmModalShowClose() {
      this.farmMapShow = false;
    },
    clearMap() {
      this.map.eachLayer(function (layer) {
        if (!layer._container) {
          layer.remove();
        }
      });
    },
    mapTo(point, size = 11) {
      // console.log(point)
      this.map.setView([point[1], point[0]], size);
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
        // if (res.data.features[0].properties.centroid)
        //   this.mapTo(res.data.features[0].properties.centroid);
        // else {
        //   this.mapTo(res.data.features[0].properties.center);
        // }
      });
    },
    load() {
      if (this.labelCheckIndex === 0) {
        http.post("/", "farm.getAll", {}).then((res) => {
          // console.log(res);
          this.farmList = res.data;
        });
      } else if (this.labelCheckIndex === 1) {
        http.post("/", "expert.getAll", {}).then((res) => {
          // console.log(res);

          this.expertList = res.data;
        });
      }
    },
    mapInit(data) {
      console.log("map init");

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
      this.getGeojson({
        province: data.farmProvince,
        city: data.farmCity,
        district: data.farmDistrict,
      });
      console.log(data);

      this.addGeoJsonToMap(data.geojson, {
        color: "#900",
        weight: 5,
        opacity: parseFloat(data.opacity),
        fillColor: data.fill_color,
        fillOpacity: parseFloat(data.fill_opacity),
      });
      this.mapTo(data.geojson.features[0].properties.center, 15);
      this.getFarm({
        province: data.farmProvince,
        city: data.farmCity,
        district: data.farmDistrict,
      });
    },
  },
  mounted() {},
  created() {
    this.load();
  },
};
</script>

<style scoped lang="scss">
.map-box {
  height: 700px;
  width: 900px;
  position: relative;
  #map {
    height: 700px;
    width: 900px;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    height: 700px;
    width: 900px;
    .loading-container {
      position: absolute;
      width: 100px;
      height: 100px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }

    .loading-item {
      width: 50px;
      height: 50px;
      position: absolute;
    }
    .item-1 {
      background-color: rgb(250, 87, 103);
      top: 0;
      left: 0;
      z-index: 1;
      animation: item-1_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
    }
    .item-2 {
      background-color: rgb(121, 68, 228);
      top: 0;
      right: 0;
      animation: item-2_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
    }
    .item-3 {
      background-color: rgb(27, 145, 247);
      bottom: 0;
      right: 0;
      z-index: 1;
      animation: item-3_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
    }
    .item-4 {
      background-color: rgb(250, 194, 76);
      bottom: 0;
      left: 0;
      animation: item-4_move 1.8s cubic-bezier(0.6, 0.01, 0.4, 1) infinite;
    }
    @keyframes item-1_move {
      0%,
      100% {
        transform: translate(0, 0);
      }

      25% {
        transform: translate(0, 50px);
      }

      50% {
        transform: translate(50px, 50px);
      }

      75% {
        transform: translate(50px, 0);
      }
    }

    @keyframes item-2_move {
      0%,
      100% {
        transform: translate(0, 0);
      }

      25% {
        transform: translate(-50px, 0);
      }

      50% {
        transform: translate(-50px, 50px);
      }

      75% {
        transform: translate(0, 50px);
      }
    }

    @keyframes item-3_move {
      0%,
      100% {
        transform: translate(0, 0);
      }

      25% {
        transform: translate(0, -50px);
      }

      50% {
        transform: translate(-50px, -50px);
      }

      75% {
        transform: translate(-50px, 0);
      }
    }

    @keyframes item-4_move {
      0%,
      100% {
        transform: translate(0, 0);
      }

      25% {
        transform: translate(50px, 0);
      }

      50% {
        transform: translate(50px, -50px);
      }

      75% {
        transform: translate(0, -50px);
      }
    }
  }
}
.container {
  min-height: calc(100vh - 140px);
  padding-top: 100px;
  padding-bottom: 40px;
  width: 100%;
  background-image: linear-gradient(to right bottom, #113123, #0f222e, #0d0320);
  // display: flex;
  min-width: 1200px;
  position: relative;
  .box {
    background: #f5f5f59d;
    border-radius: 10px;
    box-shadow: 0 0 10px 10px rgba($color: #313131, $alpha: 0.3);
    backdrop-filter: blur(3px);
  }
  .left {
    width: 300px;
    position: fixed;
    z-index: 999;
    left: 16vw;
    top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    .label {
      padding: 20px;
      width: 260px;
      text-align: center;
      transition: 0.3s;
      cursor: pointer;
      font-size: 18px;
    }
    .label-check {
      background: #d8d8d83d;
    }
    .label:hover {
      background: #d8d8d89d;
    }
    .line {
      height: 1px;
      width: 80%;
      background: #d8d8d8ff;
    }
  }
  .right {
    flex: 1;
    width: 53vw;
    min-height: calc(100vh - 140px);
    margin-left: calc(16vw + 300px + 40px);
    position: relative;
    .right-content {
      padding: 20px;
    }
    .farm {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      .item {
        background: #ffffff55;
        border-radius: 10px;
        // height: 350px;
        cursor: pointer;
        padding: 15px;
        transition: 0.3s;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .colum-2 {
          color: #555;
          font-size: 15px;
          margin-left: 25px;
        }
        .colum {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }
        .row-1 {
          display: flex;
          gap: 15px;
          .user-img {
            border-radius: 100%;
            background: #ffffffdd;
            width: 70px;
            height: 70px;
          }
        }
        .row-3,
        .row-4 {
          color: #555;
          padding-left: 10px;
          gap: 5px;
          display: flex;
          flex-direction: column;
        }
        .row-5 {
          margin-top: 5px;
          display: flex;
          gap: 15px;
          position: relative;
          height: 100px;
          .img {
            display: flex;
            flex-direction: column;
            margin-left: 40px;
            img {
              object-fit: cover;
              height: 80px;
              width: 80px;
              margin-left: 10px;
            }
            div {
              color: #555;
              text-align: center;
            }
          }

          .button-group {
            display: flex;
            min-width: 100px;
            flex-direction: column;
            gap: 8px;
            .status {
              font-size: 14px;
              color: #555;
              text-align: center;
            }
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
      }
      .item:hover {
        background: #ffffffbb;
      }
    }
    .expert {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      .item {
        background: #ffffff55;
        border-radius: 10px;
        height: 350px;
        cursor: pointer;
        padding: 15px;
        transition: 0.3s;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .colum-2 {
          color: #555;
          font-size: 15px;
          margin-left: 25px;
        }
        .colum {
          display: flex;
          flex-direction: column;
          gap: 10px;
          .tips {
            display: flex;
            gap: 4px;
            .tip {
              background: #5cb85c;
              color: #fff;
              border-radius: 4px;
              font-size: 10px;
              padding: 2px 8px;
            }
          }
        }
        .row-1 {
          display: flex;
          gap: 15px;
          .user-img {
            border-radius: 100%;
            background: #ffffffdd;
            width: 70px;
            height: 70px;
          }
        }
        .row-3,
        .row-4 {
          color: #555;
          padding-left: 10px;
        }
        .row-5 {
          margin-top: 5px;
          display: flex;
          gap: 15px;
          position: relative;
          img {
            width: 70%;
            height: 198px;
            object-fit: cover;
          }
          .button-group {
            display: flex;
            min-width: 100px;
            flex-direction: column;
            gap: 8px;
            .status {
              font-size: 14px;
              color: #555;
              text-align: center;
            }
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
      }
      .item:hover {
        background: #ffffffbb;
      }
    }
  }
}
</style>