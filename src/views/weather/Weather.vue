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
          <div class="map-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weatherBackground from "@/components/weatherBackground.vue";
import CitySelect from "@/components/CitySelect.vue";
import http from "@/axios";
export default {
  components: { weatherBackground, CitySelect },
  data() {
    return {
      weatherMain: "晴",
      citySelectValue: null,
      userInfo: null,
    };
  },
  methods: {
    citySelectChange(e) {
      this.citySelectValue = e;
      // this.getGeojson(e);
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
    .weather {
      width: 100%;
      background: #ffffff33;
      border-radius: 10px;
      box-shadow: 0 0 10px 10px rgba($color: #888888, $alpha: 0.3);
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
    box-shadow: 0 0 10px 10px rgba($color: #888888, $alpha: 0.3);
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out,
    height 0.3s ease-in-out;
    background: #ffffff33;
  }
}
</style>
<style>
.select-group {
  box-shadow: 0 0 10px 10px rgba(130, 130, 130, 0.3) !important;
  background: #ffffff33 !important;
}

</style>