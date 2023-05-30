<template>
  <div class="main">
    <div class="map-box" id="map-box">
      <div id="map">
        <div class="map-container"></div>
      </div>
    </div>
    <div class="right">
      <CitySelect
        @change="citySelectChange"
        :city="citySelectValue.city"
        :district="citySelectValue.district"
      ></CitySelect>
      <div class="edit" id="edit">
        <div class="tip" id="tip">
          请点击地图左侧编辑工具画出一片区域<br />以进行下一步操作
        </div>
        <div class="area row">
          <LineInput
            :placeholderColor="'#bbbbbb'"
            :fontSize="16"
            :placeholder="'农田面积'"
            v-model="farm.area"
            :lineColor="'#bbbbbb'"
            :color="'#ffffff'"
            :disabled="true"
          ></LineInput>
        </div>
        <div class="name row">
          <LineInput
            :placeholderColor="'#bbbbbb'"
            :fontSize="16"
            :placeholder="'农田名称'"
            v-model="farm.name"
            :lineColor="'#bbbbbb'"
            :color="'#ffffff'"
            ref="name"
          ></LineInput>
        </div>
        <div class="plant row">
          <LineInput
            :placeholderColor="'#bbbbbb'"
            :fontSize="16"
            :placeholder="'种植作物'"
            v-model="farm.plant"
            :lineColor="'#bbbbbb'"
            :color="'#ffffff'"
            ref="plant"
          ></LineInput>
        </div>
        <div class="color row">
          <div class="label">区块颜色：</div>
          <input type="color" v-model="farm.color" />
        </div>
        <div class="introduce row">
          <el-input
            v-model="farm.introduce"
            placeholder="农田简介"
            type="textarea"
            :rows="7"
            :autosize="false"
            :resize="false"
          ></el-input>
        </div>
        <div class="empty"></div>
        <div class="button-group">
          <Button
            style="flex: 1"
            :borderRadius="8"
            :special="{ line: false, color: '#d69b3C' }"
            :padding="'0'"
            @click="reDraw"
          >
            <div class="button-box">
              <div class="label">重 画</div>
              <div class="icon" style="background: #e6a23cff">
                <RefreshRight class="icon-m"></RefreshRight>
              </div>
            </div>
          </Button>
          <Button
            style="flex: 1"
            :borderRadius="8"
            :special="{ line: false, color: '#408EeF' }"
            :padding="'0'"
            @click="submitClick"
          >
            <div class="button-box">
              <div class="label">提 交</div>
              <div class="icon" style="background: #409effff">
                <Finished class="icon-m"></Finished>
              </div>
            </div>
          </Button>
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
import CitySelect from "@/components/CitySelect.vue";
import LineInput from "@/components/LineInput.vue";
import Button from "@/components/Button.vue";
import http from "@/axios";
export default {
  components: { CitySelect, LineInput, Button },
  data() {
    return {
      map: null,
      citySelectValue: null,
      farm: {
        name: "",
        plant: "",
        color: "#42b983",
        introduce: "",
        area: "",
      },
      editFlag: false,
      geo: null,
    };
  },
  methods: {
    getFarm() {
      http.post("/", "farm.getZC", this.citySelectValue).then((res) => {
        let data = res.data;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let dom = this.addGeoJsonToMap(
            data[i].geojson,
            {
              color: data[i].color,
              weight: parseFloat(data[i].weight),
              opacity: parseFloat(data[i].opacity),
              fillColor: data[i].fill_color,
              fillOpacity: parseFloat(data[i].fill_opacity),
            });
        }
      });
    },
    submitClick() {
      if (this.farm.name === "") {
        this.$refs.name.shake("请填写农田名称");
        return;
      }
      if (this.farm.plant === "") {
        this.$refs.plant.shake("请填写种植作物");
        return;
      }
      let user = JSON.parse(localStorage.getItem("user"));
      http
        .post("/", "farm.submit", {
          farm: this.farm,
          geojson: this.geo,
          email: user.email,
          pcd: this.citySelectValue,
          style: {
            fillColor: this.farm.color,
            fillOpacity: 0.3,
            weight: 1,
            color: '#000000',
            opacity: 1
          }
        })
        .then((res) => {
          if (res.status === 200) {
            this.$message.success("提交成功！");
            this.$router.push({ path: "/user" });
          } else {
            throw new Error();
          }
        })
        .catch((e) => {
          this.$message.error("提交失败！");
        });
    },
    reDraw() {
      this.editFlag = false;
      this.getGeojson(this.citySelectValue, false);
      document.getElementById("tip").style.marginTop = "0";
      document.getElementById("edit").style.maxHeight = "60px";
      this.farm = {
        name: "",
        plant: "",
        color: "#42b983",
        introduce: "",
        area: "",
      };
    },
    getEditJson(type, drawlayer, draw) {
      let geo;
      let center = [0, 0];
      if (type === "polygon") {
        if (drawlayer._latlngs[0].length > 0) {
          let v = [];
          center = [draw._latlngs[0][0].lng, draw._latlngs[0][0].lat];
          for (
            var latlngslength = 0;
            latlngslength < drawlayer._latlngs[0].length;
            latlngslength++
          ) {
            v.push([
              draw._latlngs[0][latlngslength].lng,
              draw._latlngs[0][latlngslength].lat,
            ]);
            center[0] = (center[0] + draw._latlngs[0][latlngslength].lng) / 2;
            center[1] = (center[1] + draw._latlngs[0][latlngslength].lat) / 2;
          }
          geo = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  center: center,
                },
                geometry: {
                  type: "Polygon",
                  coordinates: [v],
                },
              },
            ],
          };
        }
      }
      //获取矩形几何信息
      else if (type === "rectangle") {
        // console.log(draw);

        if (draw._latlngs[0].length) {
          let v = [];
          center = [draw._latlngs[0][0].lng, draw._latlngs[0][0].lat];
          for (
            var latlngslength = 0;
            latlngslength < draw._latlngs[0].length;
            latlngslength++
          ) {
            //获取几何信息
            v.push([
              draw._latlngs[0][latlngslength].lng,
              draw._latlngs[0][latlngslength].lat,
            ]);
            center[0] = (center[0] + draw._latlngs[0][latlngslength].lng) / 2;
            center[1] = (center[1] + draw._latlngs[0][latlngslength].lat) / 2;
          }

          geo = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  center: center,
                },
                geometry: {
                  type: "Polygon",
                  coordinates: [v],
                },
              },
            ],
          };
        }
      }
      //获取圆几何信息
      else if (type == "circle") {
        // console.log(drawlayer);

        if (drawlayer._mRadius > 0) {
          let v = [];
          //绘制完成后，获取圆形的半径和中心点坐标
          var radius = drawlayer._mRadius / 100000;
          var lonlat = draw._latlng;
          //   console.log(radius);
          //点集
          //计算圆的边缘所有点
          for (var i = 0; i < 360; i += 10) {
            var radians = ((i + 1) * Math.PI) / 180;
            v.push([
              Math.sin(radians) * radius * 1.5 + lonlat.lng,
              Math.cos(radians) * radius + lonlat.lat,
            ]);
            // var circlePoint = {lat: Math.cos(radians) * radius + lonlat.lat, lang: Math.sin(radians) * radius + lonlat.lng}
            //
            // parts[i] = circlePoint;
          }
          //   console.log(v);
          // console.log(parts)
          geo = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  center: [drawlayer._latlng.lng, drawlayer._latlng.lat],
                },
                geometry: {
                  type: "Polygon",
                  coordinates: [v],
                },
              },
            ],
          };
        }
      }
      this.geo = geo;
      // console.log(geo)
      this.addGeoJsonToMap(geo, {
        color: "#000",
        weight: 1,
        opacity: 1,
        fillColor: "#42b983",
        fillOpacity: 0.3,
      });
    },
    toEdit() {
      this.editFlag = true;
      this.getGeojson(this.citySelectValue, false);
      document.getElementById("tip").style.marginTop = "-90px";
      document.getElementById("edit").style.maxHeight = "1000px";
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
      }
    ) {
      let dom = L.geoJson(json, data).addTo(this.map);
    },
    getGeojson(data, to = true) {
      this.clearMap();
      http.post("/", "map.getMap", data).then((res) => {
        // console.log(res);
        this.addGeoJsonToMap(res.data);
        if (to && res.data.features[0].properties.centroid)
          this.mapTo(res.data.features[0].properties.centroid);
        else if (to) {
          this.mapTo(res.data.features[0].properties.center);
        }
      });
    },
    citySelectChange(e) {
      // console.log(e);
      this.citySelectValue = e;
      this.getGeojson(e);
      this.getFarm()
    },
    formatArea(polygon) {
      //L.GeometryUtil.geodesicArea(),返回number类型的数据，单位是平方米，这里做了一下转化
      var seeArea = L.GeometryUtil.geodesicArea(polygon);
      let area = seeArea.toFixed(2) + "㎡";
      return area;
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
    let that = this;
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
    map.on(L.Draw.Event.CREATED, function (e) {
      //获取绘制图形类型
      let type = e.layerType;
      //获取绘制图层
      let drawlayer = e.layer;
      let draw = e.layer;
      //显示图层
      drawnItems.addLayer(drawlayer);
      let area = "";
      //几何信息字符串
      var latlngsStr = "";
      //获取多边形几何信息
      if (type == "polygon") {
        if (drawlayer._latlngs[0].length > 0) {
          latlngsStr += "多边形\n";
          for (
            var latlngslength = 0;
            latlngslength < drawlayer._latlngs[0].length;
            latlngslength++
          ) {
            //获取几何信息
            latlngsStr +=
              " " +
              drawlayer._latlngs[0][latlngslength].lat +
              "," +
              drawlayer._latlngs[0][latlngslength].lng +
              "\n";
          }
          area = that.formatArea(draw._latlngs[0]);
          latlngsStr += "面积：" + area;
        }
      }
      //获取矩形几何信息
      else if (type == "rectangle") {
        if (drawlayer._latlngs[0].length) {
          latlngsStr += "矩形\n";
          for (
            var latlngslength = 0;
            latlngslength < drawlayer._latlngs[0].length;
            latlngslength++
          ) {
            //获取几何信息
            latlngsStr +=
              " " +
              drawlayer._latlngs[0][latlngslength].lat +
              "," +
              drawlayer._latlngs[0][latlngslength].lng +
              "\n";
          }
          area = that.formatArea(draw._latlngs[0]);
          latlngsStr += "面积：" + area;
        }
      }
      //获取圆几何信息
      else if (type == "circle") {
        if (drawlayer._radius > 0) {
          latlngsStr += "圆形\n";
          //获取几何信息
          latlngsStr +=
            " 圆心坐标：" +
            drawlayer._latlng.lat +
            "," +
            drawlayer._latlng.lng +
            "\n" +
            " 半径：" +
            drawlayer._radius +
            "\n";
        }
        //绘制完成后，获取圆形的半径和中心点坐标
        var radius = drawlayer._mRadius;
        var lonlat = drawlayer._latlng;
        console.log(radius + ";  " + lonlat);
        area = (radius * radius * Math.PI).toFixed(2) + "m²";
        latlngsStr += "面积：" + area;
      }
      that.toEdit();
      that.getEditJson(type, drawlayer, draw);
      that.farm.area = area;
      //显示信息;
      console.log(latlngsStr);
    });

    this.getGeojson(this.citySelectValue);
    this.getFarm()
  },
  created() {
    if (!JSON.parse(localStorage.getItem("user"))) {
      this.$message.success("请先登录！");
      this.$router.push("index");
      return;
    }
    if (!this.$route.query.city) {
      this.citySelectValue = {
        city: "吉林",
        district: "船营",
        id: "2679",
        province: "吉林",
      };
    }
    this.citySelectValue = this.$route.query;
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
  padding-left: 40px;
  padding-right: 40px;
  gap: 45px;
  min-height: calc(100vh - 95px);
  background-image: linear-gradient(to right bottom, #0d0320, #0f222e, #1a0c00);
  .right {
    flex: 1;
    height: 85vh;
    gap: 30px;
    display: flex;
    flex-direction: column;
    transition: 0.5s;
    min-width: 360px;
    .select-group {
      color: #fff;
    }
    .edit {
      box-shadow: 0 0 10px 10px rgba($color: #333, $alpha: 0.3);
      border-radius: 10px;
      flex: 1;
      background: #bbbbbb88;
      max-height: 60px;
      padding: 15px;
      transition: 0.5s;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .tip {
        color: #fff;
        font-size: 18px;
        line-height: 30px;
        transition: 0.5s;
      }
      .row {
        height: 70px;
      }
      .area {
        margin-top: 30px;
      }
      .color {
        color: #bbb;
        display: flex;
        align-items: center;
        height: 50px;
        input {
          background: #bbb;
          border: none;
          border-radius: 6px;
          padding: 2px 5px;
          width: 100px;
          cursor: pointer;
        }
      }
      .introduce {
        margin-top: 20px;
      }
      .empty {
        flex: 1;
      }
      .button-group {
        display: flex;
        gap: 20px;
        .button-box {
          height: 46px;
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          .label {
            line-height: 46px;
            width: 100%;
            text-align: center;
            margin-left: -15px;
            font-size: 18px;
          }
          .icon {
            position: absolute;
            height: 46px;
            width: 46px;
            top: 0;
            right: 0;
            transition: 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            .icon-m {
              width: 30px;
              height: 30px;
            }
          }
        }
        .button-box:hover .icon {
          width: 100%;
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
    box-shadow: 0 0 10px 10px rgba($color: #333, $alpha: 0.3);
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
.select-group {
  box-shadow: 0 0 10px 10px rgba(30, 30, 30, 0.3) !important;
}
.option {
  width: 130px !important;
}
.list {
  width: 130px !important;
}
.edit .el-textarea__inner {
  background: transparent;
  border-color: #bbb;
  box-shadow: 0 0 0 1px #ddd inset;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  padding: 8px 12px;
}
</style>