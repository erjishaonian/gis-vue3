<template>
  <div class="container user-container">
    <div class="logout button-click" @click="logout">
      <div class="label">退出登录</div>
      <Remove class="icon" />
    </div>
    <div class="left">
      <CitySelect
        class="box city-select"
        :city="this.userInfo.city"
        :district="this.userInfo.district"
        @change="citySelectChange"
        :onlyRead="!edit"
      ></CitySelect>
      <div class="user-info box">
        <div class="edit button-click" @click="editClick">
          <div class="label">编辑</div>
          <Edit class="icon" />
        </div>
        <div class="save button-click" id="save" @click="saveClick">
          <div class="label">
            <Finished class="icon"></Finished>
            <div class="text">保存</div>
          </div>
          <div class="sure">确认保存</div>
        </div>
        <div class="row-1 row">
          <div class="img" @click="userImgClick">
            <img v-if="userInfo.img" :src="userInfo.img" />
            <img
              v-else
              src="@/assets/img/farm.png"
              style="height: 70px; width: 70px; margin: 10px"
            />
            <input
              type="file"
              id="user-img"
              accept="image/*"
              ref="fileInput"
              @change="uploadUserImage"
              style="display: none"
            />
          </div>
          <div class="content">
            <div v-if="!edit" class="name">{{ userInfo.username }}</div>
            <div v-else class="name">
              <el-input
                v-model="userInfo.username"
                placeholder="昵称"
              ></el-input>
            </div>
            <div class="email">{{ userInfo.email }}</div>
          </div>
        </div>
        <div class="row-2" id="row-2">
          <div class="introduce content" id="introduce">
            <div class="label">个人简介</div>
            <div class="m">:</div>
            <div v-if="!edit" class="text">
              {{ userInfo.introduce || "未填写" }}
            </div>
            <div v-else class="text">
              <el-input
                v-model="userInfo.introduce"
                placeholder="个人简介"
                type="textarea"
              ></el-input>
            </div>
          </div>
          <div class="line"></div>
          <div class="hide content">
            <div class="label">是否隐藏</div>
            <div class="m">:</div>
            <div class="text">
              <CheckBox
                v-model="hide"
                :color="'#555555'"
                @change="hideChange"
              ></CheckBox>
            </div>
          </div>
          <div class="real-name content">
            <div class="label">真实姓名</div>
            <div class="m">:</div>
            <div v-if="!edit" class="text">
              {{ userInfo.real_name || "未填写" }}
            </div>
            <div v-else class="text">
              <el-input
                v-model="userInfo.real_name"
                placeholder="真实姓名"
              ></el-input>
            </div>
          </div>
          <div class="phone content">
            <div class="label">手机号</div>
            <div class="m">:</div>
            <div v-if="!edit" class="text">
              {{ userInfo.phone || "未填写" }}
            </div>
            <div v-else class="text">
              <el-input
                v-model="userInfo.phone"
                placeholder="手机号"
              ></el-input>
            </div>
          </div>
          <div class="wx content">
            <div class="label">微信号</div>
            <div class="m">:</div>
            <div v-if="!edit" class="text">{{ userInfo.wx || "未填写" }}</div>
            <div v-else class="text">
              <el-input v-model="userInfo.wx" placeholder="微信号"></el-input>
            </div>
          </div>
          <div class="qq content">
            <div class="label">Q Q号</div>
            <div class="m">:</div>
            <div v-if="!edit" class="text">{{ userInfo.qq || "未填写" }}</div>
            <div v-else class="text">
              <el-input v-model="userInfo.qq" placeholder="qq号"></el-input>
            </div>
          </div>
          <div class="address content">
            <div class="label">详细住址</div>
            <div class="m">:</div>
            <div v-if="!edit" class="text">
              {{ userInfo.address || "未填写" }}
            </div>
            <div v-else class="text">
              <el-input
                v-model="userInfo.address"
                placeholder="详细住址"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="save-box" id="save-box"></div>
      </div>
    </div>
    <div class="right">
      <div class="expert" v-if="userInfo.role !== '专家'">
        <Button :borderRadius="10" type="main" @click="openExpertModal"
          >专家认证</Button
        >
      </div>
      <div class="row-1">
        <div class="c c-1">
          <div class="label">已发布农田数量</div>
          <div class="m">：</div>
          <div class="value">{{ total.pub }}</div>
        </div>
        <div class="c c-2">
          <div class="label">正在申请农田数量</div>
          <div class="m">：</div>
          <div class="value">{{ total.sub }}</div>
        </div>
        <!-- <div class="c c-3">
          <div class="label">上次登录时间</div>
          <div class="m">：</div>
          <div class="value">
            {{this.getDate(userInfo.last_login)}}
          </div>
        </div> -->
        <div class="c c-4">
          <div class="m">注册时间</div>
          <div class="label">：</div>
          <div class="value">{{ this.getDate(userInfo.create_time) }}</div>
        </div>
      </div>
      <div class="row-2">
        <div v-for="(item, i) in farmList" :key="i" class="item">
          <div class="row-3">
            <div>
              省-市-区：{{ item.farmProvince }} - {{ item.farmCity }} -
              {{ item.farmDistrict }}
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
              <div class="status">当前状态：{{ item.farmStatus }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <Modal
      title="专家认证"
      :show="expertShow"
      @close="closeExpertModal"
      :borderRadius="20"
      :width="700"
      class="expert-m"
    >
      <div class="expert-modal">
        <div class="form">
          <LineInput
            v-model="expertForm.tip"
            :placeholder="'研究方向(使用-分隔)'"
            ref="tip"
          ></LineInput>
          <LineInput
            v-model="expertForm.education"
            :placeholder="'最高学历'"
            ref="education"
          ></LineInput>
          <LineInput
            v-model="expertForm.school"
            :placeholder="'毕业院校'"
            ref="school"
          ></LineInput>
          <div class="img-box">
            <div class="img-box-label">资质图片</div>
            <div class="img-input" @click="expertImgClick">
              <img :src="expertForm.img" />
            </div>
            <input
              type="file"
              id="expert-img"
              accept="image/*"
              ref="expertFileInput"
              @change="uploadExpertImage"
              style="display: none"
            />
          </div>
          <el-input
            v-model="expertForm.introduce"
            placeholder="专家介绍"
            type="textarea"
          ></el-input>
          <el-input
            v-model="expertForm.content"
            placeholder="补充说明"
            type="textarea"
          ></el-input>
          <Button
            :borderRadius="10"
            type="main"
            @click="submitExpert"
            :padding="'10px 40px'"
            style="margin-top: 20px"
            >提交</Button
          >
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
import CitySelect from "@/components/CitySelect.vue";
import CheckBox from "@/components/CheckBox.vue";
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import LineInput from "@/components/LineInput.vue";
import http from "@/axios";
export default {
  components: { CitySelect, CheckBox, Button, Modal, LineInput },
  data() {
    return {
      userInfo: {},
      hide: false,
      edit: false,
      expertShow: false,
      farmMapShow: false,
      mapLoading: true,
      expertForm: {
        tip: "",
        introduce: "",
        education: "",
        school: "",
        content: "",
        img: require("@/assets/img/add.png"),
      },
      expertSaveImg: false,
      farmList: [],
      map: null,
      total: {
        sub: 0,
        pub: 0,
      },
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
      console.log(data.geojson.features[0].properties.center);

      this.mapTo(data.geojson.features[0].properties.center, 15);
      this.getFarm({
        province: data.farmProvince,
        city: data.farmCity,
        district: data.farmDistrict,
      });
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
    getDate(time) {
      let now = new Date(time);
      let year = now.getFullYear();
      let month =
        now.getMonth() + 1 < 10
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1;
      let date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
      let hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      let minute =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      let second =
        now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();

      let formatTime = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
      return formatTime;
    },
    submitExpert() {
      if (this.expertForm.tip === "") {
        this.$refs.tip.shake("请填写研究方向");
        return;
      }
      if (this.expertForm.education === "") {
        this.$refs.education.shake("请填写研究方向");
        return;
      }
      if (this.expertForm.school === "") {
        this.$refs.school.shake("请填写研究方向");
        return;
      }
      if (this.expertSaveImg === false) {
        this.$message.error("请上传资质图片！");
        return;
      }
      http
        .post("/", "expert.create", {
          expert: this.expertForm,
          email: this.userInfo.email,
        })
        .then((res) => {
          if (res.status === 200) {
            this.$message.success("提交成功！");
            this.expertShow = false;
          } else {
            throw new Error();
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("提交失败！");
        });
    },
    openExpertModal() {
      this.expertShow = true;
    },
    closeExpertModal() {
      this.expertShow = false;
    },
    logout() {
      localStorage.setItem("user", null);
      localStorage.setItem("alwaysLogin", null);
      localStorage.setItem("user-info", null);
      this.$router.push("index");
    },
    citySelectChange(e) {
      this.userInfo.province = e.province;
      this.userInfo.city = e.city;
      this.userInfo.district = e.district;
    },
    uploadUserImage() {
      const file = this.$refs.fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        this.userInfo.saveImg = true;
        this.userInfo.img = base64String;
        console.log("Base64编码的图片数据:", base64String);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    uploadExpertImage() {
      const file = this.$refs.expertFileInput.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        this.expertSaveImg = true;
        this.expertForm.img = base64String;
        console.log("Base64编码的图片数据:", base64String);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    userImgClick() {
      if (!this.edit) return;
      document.getElementById("user-img").click();
    },
    expertImgClick() {
      document.getElementById("expert-img").click();
    },
    editClick() {
      if (this.edit) return;
      this.edit = true;
      document.getElementById("save-box").style.maxHeight = "38px";
      document.getElementById("save").style.bottom = "15px";
      document.getElementById("introduce").style.maxHeight = "100px";
    },
    saveClick() {
      http
        .post("/", "user.editUserInfo", this.userInfo)
        .then((res) => {
          if (res.status === 200) {
            this.$message.success("修改成功！");
            this.load();
          } else {
            throw new Error();
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message.error("修改失败！");
        });
      this.edit = false;
      document.getElementById("save-box").style.maxHeight = "0";
      document.getElementById("save").style.bottom = "-45px";
      document.getElementById("introduce").style.maxHeight = "32px";
    },
    hideChange(e) {
      if (e) {
        this.userInfo.hide = 1;
      } else {
        this.userInfo.hide = 0;
      }
    },
    load() {
      let user = JSON.parse(localStorage.getItem("user-info"));
      http.post("/", "user.getUserInfo", user).then((res) => {
        this.userInfo = res.data;
        this.hide = this.userInfo.hide === 0 ? false : true;
      });
      http.post("/", "farm.getList", { email: user.email }).then((res) => {
        this.total = {
          sub: 0,
          pub: 0,
        };
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].farmStatus === "正常") this.total.pub++;
          else if (res.data[i].farmStatus === "待审核") this.total.sub++;
          
        }
        this.farmList = res.data;
        console.log(this.farmList)
        
      });
    },
  },
  created() {
    this.load();
  },
};
</script>

<style scoped lang="scss">
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
    .user-info {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      z-index: -1;
      .row {
        display: flex;
      }
      .row-1 {
        gap: 20px;
        .img {
          overflow: hidden;
          border-radius: 100%;
          width: 90px;
          height: 90px;
          background: #cccccc;
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
            width: 140px;
            font-size: 22px;
            font-weight: 500;
            height: 34px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .email {
            margin-top: 10px;
            width: 200px;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .row-2 {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding-left: 10px;
        transition: 0.5s;
        .line {
          background: #555555;
          width: 100%;
          height: 1px;
        }
        .content {
          display: flex;
          min-height: 32px;
          max-height: 32px;
          align-items: center;
          transition: 0.3s;
          .label {
            text-align: justify;
            text-align-last: justify;
            /*兼容ie*/
            text-justify: distribute-all-lines;
            width: 70px;
          }
          .m {
            width: 20px;
            text-align: center;
          }
          .text {
            width: 250px;
            white-space: pre-wrap;
          }
        }
        .hide {
          align-items: center;
          .text {
            width: fit-content;
          }
        }
      }
      .edit {
        position: absolute;
        top: 15px;
        right: 40px;
        color: #ddd;
        background: #111;
        border-radius: 38px;
        overflow: hidden;
        width: 38px;
        height: 38px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 0 3px 3px rgba($color: #2e2d2d7c, $alpha: 0.3);
        transition: 0.5s;
        .label {
          margin-top: -20px;
          transition: 0.5s;
        }
        .icon {
          margin-top: 4px;
          width: 28px;
          transition: 0.5s;
        }
      }
      .edit:hover {
        width: 88px;
        right: 15px;
      }
      .edit:hover .label {
        margin-top: 0;
      }
      .save {
        position: absolute;
        bottom: -45px;
        right: 15px;
        transition: 0.5s;
        background: #111;
        color: #ddd;
        cursor: pointer;
        box-shadow: 0 0 3px 3px rgba($color: #2e2d2d7c, $alpha: 0.3);
        border-radius: 38px;
        overflow: hidden;
        height: 38px;
        padding: 0 8px;
        .label {
          margin-top: 7px;
          display: flex;
          gap: 8px;
          justify-content: center;
          transition: 0.5s;
          .icon {
            height: 22px;
          }
        }
        .sure {
          margin-top: 8px;
        }
      }
      .save-box {
        height: 38px;
        max-height: 0;
        transition: 0.5s;
      }
      .save:hover .label {
        margin-top: -23px;
      }
    }

    width: 380px;
    position: fixed;
    z-index: 999;
    left: 14vw;
  }
  .right {
    background: #f5f5f59d;
    border-radius: 10px;
    box-shadow: 0 0 10px 10px rgba($color: #313131, $alpha: 0.3);
    backdrop-filter: blur(3px);
    flex: 1;
    width: 50vw;
    min-height: 780px;
    margin-left: calc(14vw + 380px + 40px);
    position: relative;
    .row-1 {
      padding: 20px;
      display: flex;
      gap: 60px;
      font-size: 18px;
      .c {
        display: flex;
      }
    }
    .row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      padding: 20px;
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
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
.button-click:active {
  animation: button-click 0.5s;
}
@keyframes button-click {
  20% {
    transform: scale(0.95);
  }
  60% {
    transform: scale(1.03);
  }
}
.logout {
  position: absolute;
  top: 100px;
  right: 60px;
  color: #ddd;
  background: #7c0000;
  border-radius: 42px;
  overflow: hidden;
  width: 45px;
  height: 45px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 99;
  cursor: pointer;
  box-shadow: 0 0 3px 3px rgba($color: #2e2d2d7c, $alpha: 0.3);
  transition: 0.5s;
  .label {
    margin-top: -24px;
    transition: 0.5s;
    white-space: nowrap;
    font-size: 18px;
  }
  .icon {
    margin-top: 8px;
    width: 28px;
    transition: 0.5s;
  }
}
.logout:hover {
  width: 100px;
  right: 35px;
}
.logout:hover .label {
  margin-top: 0;
}
.expert-modal {
  width: 100%;
  padding: 30px 0 20px 0;
  display: flex;
  justify-content: center;
  .form {
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-end;
    padding-bottom: 30px;
    .img-box {
      width: 350px;
      height: 180px;
      .img-box-label {
        color: #888;
        padding-left: 10px;
        line-height: 30px;
        margin-bottom: 10px;
      }
      .img-input {
        height: 140px;
        width: 140px;
        overflow: hidden;
        border-radius: 10px;
        border: 2px dashed #888;
        cursor: pointer;
        transition: 0.3s;
        img {
          height: 140px;
          width: 140px;
          object-fit: cover;
        }
      }
      .img-input:hover {
        background: #ffffff55;
      }
    }
  }
}
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
</style>
<style>
.select-group {
  background: #f5f5f59d !important;
}
.select-group .list {
  width: 130px !important;
}
.option {
  background: #444444dd !important;
  position: relative !important;
  z-index: 999 !important;
  width: 130px !important;
  color: #ddd !important;
  backdrop-filter: blur(2px) !important;
}
.option:hover {
  background: #5a5a5add !important;
}
.user-info .el-input__wrapper {
  background: transparent;
  border-color: #bbb;
  box-shadow: 0 0 0 1px #ddd inset;
}
.user-info .el-textarea__inner {
  background: transparent;
  border-color: #bbb;
  box-shadow: 0 0 0 1px #ddd inset;
}
.el-textarea__inner {
  background: transparent;
  border-color: #555;
}
.el-textarea {
  --el-input-focus-border-color: #555;
  --el-input-border-color: #888;
}
.el-textarea:hover {
  --el-input-border-color: #666;
}
.user-container .expert-m .modal-main {
  background-color: #ffffffbb !important;
}
.user-container .expert-m .modal-main .title {
  top: 100% !important;
}
</style>