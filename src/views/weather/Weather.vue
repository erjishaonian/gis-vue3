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
        <div class="disaster" :class="{ loading: loading }">
          <div v-if="disaster.result === null" class="none">
            <div class="title">暂没有预警信息，一切正常</div>
            <img src="@/assets/img/草原.png">
          </div>
          <div v-else class="disaster-container">
            <div class="row row-1">
              <div class="icon box-click">
                <div class="title">
                  <BellFilled style="width:50px;height:50px"></BellFilled>
                  <div>{{disaster.result[0].title}}</div>
                </div>
              </div>
              <div class="right-content">
                <div class="type">灾害类型：{{disaster.result[0].type}}</div>
                <div class="level">灾害级别：{{disaster.result[0].level}}</div>
              </div>
            </div>
            <div class="row-2">
              {{disaster.result[0].content}}
            </div>
          </div>
        </div>
      </div>
      <div class="right" id="right">
        <div class="weather" :class="{ loading: loading }">
          <div class="row row-1">
            <div class="icon box-click">
              <img
                :src="
                  require('@/assets/img/weather-icon/' + (weatherMain.replace(/^.+转/, '')) + '.png')
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
            <div class="right-content">
              <div class="line-1">
                <div class="temperature">
                  {{
                    String(weather.future[0].temperature).replace("/", " ~ ")
                  }}
                </div>
                <div class="direct">
                  {{ weather.realtime.direct }}
                </div>
                <div class="empty"></div>
                <div class="city">
                  <LocationInformation
                    style="height: 24px; margin-right: 8px"
                  ></LocationInformation
                  >{{ citySelectValue.city }}
                </div>
              </div>
              <div class="line-2">
                <div class="humidity">
                  湿度：{{ weather.realtime.humidity }}%
                </div>
                <div class="humidity">风力：{{ weather.realtime.power }}</div>
                <div class="humidity">空气指数：{{ weather.realtime.aqi }}</div>
                <div class="humidity">更新时间：{{ time }}</div>
              </div>
            </div>
          </div>
          <div class="row row-2">
            <div class="title">未来5天天气预报</div>
            <div class="list">
              <div
                v-for="(item, i) in weather.future"
                :key="i"
                class="item"
              >
                <img
                  :src="
                    require('@/assets/img/weather-icon/' +
                      (item.weather.replace(/^.+转/, '')) +
                      '.png')
                  "
                />
                <div class="weather-m">
                  {{ item.weather }}
                </div>
                <div class="temperature">
                  {{ String(item.temperature).replace("/", " ~ ") }}
                </div>
                <div class="direct">
                  {{ item.direct }}
                </div>
                <div class="date">
                  {{ item.date }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="admin button-click" @click="admin"></div>
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
      time: null,
      loading: false,
      disaster: {"reason":"success","result":null,"error_code":0}
    };
  },
  methods: {
    getWeather() {
      this.loading = true;
      this.time = new Date().toLocaleTimeString("en-US", { hour12: false });
      http.post("/", "weather.getWeather", this.citySelectValue).then((res) => {
        let data = res.data.result;
        console.log(data.realtime.info);
        this.weather = data;
        this.weatherMain = data.realtime.info;
        this.loading = false;
      });
    },
    getDisaster() {
      http
        .post("/", "disaster.getDisaster", this.citySelectValue)
        .then((res) => {
          // console.log(res)
          this.disaster = res.data
        });
    },
    citySelectChange(e) {
      this.citySelectValue = e;
      this.getWeather();
      this.getDisaster();
      // this.getGeojson(e);
    },
    load() {
      let user = JSON.parse(localStorage.getItem("user-info"));

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
      this.getWeather();
      this.getDisaster();
    },
    admin() {
      let list = [
        "晴",
        "阵雨",
        "小雨",
        "中雨",
        "大雨",
        "暴雨",
        "大暴雨",
        "冻雨",
        "阵雪",
        "小雪",
        "中雪",
        "大雪",
        "雷阵雨",
        "雾",
        "霾",
        "浮尘",
        "扬沙",
        "强沙尘暴",
        "多云",
        "阴",
      ];
      let index = list.indexOf(this.weatherMain);
      this.weatherMain = list[(index + 1) % list.length];
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
  .left {
    position: absolute;
    top: 18vh;
    width: 440px;
    height: 60vh;
    gap: 30px;
    left: 10vw;
    display: flex;
    flex-direction: column;
    color: #ffffff;
    transition: 0.5s;
    .disaster {
      width: 100%;
      background: #bbbbbb55;
      border-radius: 10px;
      box-shadow: 0 0 5px 5px rgba($color: #333333, $alpha: 0.3);
      backdrop-filter: blur(3px);
      flex: 1;
      overflow: hidden;
      position: relative;
      .disaster-container{
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .none{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        .title{
          color: #fff;
          font-size: 20px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          z-index: 999;
          margin-top: 20px;
        }
        img{
          margin-top: 20px;
          height: 88%;
          object-fit: cover;
          transition: .5s;
        }
      }
      .none:hover img{
        transform: scale(1.02);
      } 
      .row {
        display: flex;
        padding: 20px 20px;
      }
      .row-1 {
        .icon {
          background: #ffffffbb;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
          display: flex;
          gap: 15px;
          color: #000;
          transition: .3s;
          width: 35%;
          .title{
            display: flex;
            gap: 10px;
            div{
              text-align: right;
            }
          }
          
        }
        .right-content {
          flex: 1;
          padding: 20px 0 0 50px;
              font-size: 16px;
              line-height: 24px;
            .level {
              margin-top: 15px;
            }
          }
      }
      .row-2{
        background: #ffffff55;
        border-radius: 20px;
        color: #000;
        margin: 0 20px 20px 20px;
        padding: 10px 20px;
        line-height: 2;
        transition: .5s;
        overflow-y: auto;
        flex: 1;
        
        cursor: pointer;
          box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
      }
      .row-2:hover {
            background: #ffffffbb;
            box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
          }
    }
  }
  .right {
    position: absolute;
    width: 55vw;
    min-width: 700px;
    height: 60vh;
    top: 18vh;
    right: 10vw;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px 5px rgba($color: #333333, $alpha: 0.3);
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out,
      height 0.3s ease-in-out;
    background: #bbbbbb55;
    .weather {
      width: 100%;
      flex: 1;
      .row {
        display: flex;
        padding: 20px 20px;
      }
      .row-1 {
        .icon {
          background: #ffffffbb;
          padding: 20px;
          border-radius: 35px;
          box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
          display: flex;
          gap: 15px;
          color: #333;
          transition: .3s;
          img {
            width: 100px;
            height: 100px;
          }
          .content {
            // padding: 5px;
            .temperature {
              font-size: 55px;
              line-height: 65px;
              font-weight: 900;
            }
            .info {
              line-height: 35px;
              font-size: 20px;
            }
          }
        }
        .right-content {
          flex: 1;
          padding: 35px 40px;
          font-size: 22px;
          .line-1 {
            color: #fff;
            display: flex;
            gap: 50px;
            .city {
              display: flex;
              font-size: inherit;
              white-space: nowrap;
              width: fit-content;
            }
          }
          .line-2 {
            margin-top: 20px;
            color: #ddd;
            display: flex;
            gap: 50px;
            font-size: 16px;
          }
        }
      }
      .row-2 {
        display: flex;
        flex-direction: column;
        .title {
          color: #eee;
          padding-left: 20px;
        }
        .list {
          margin-top: 30px;
          display: flex;
          gap: 30px;
          margin-left: 15px;
          .item {
            display: flex;
            flex-direction: column;
            background: #ffffff55;
            border-radius: 20px;
            padding: 20px;
            align-items: center;
            width: 130px;
            gap: 10px;
            height: 230px;
            color: #000;
            transition: 0.5s;
            cursor: pointer;
            img {
              width: 80px;
              height: 80px;
              margin: 10px 0;
            }
            .weather-m {
              font-size: 22px;
            }
            
            
          }
          .item:hover {
            background: #ffffffbb;
            box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
            transform: translateY(-10px);
          }
        }
      }
    }
  }
}
.admin {
  position: absolute;
  top: 100px;
  right: 60px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background: #ffffffbb;
  box-shadow: 0 0 6px 6px rgba($color: #888888, $alpha: 0.3);
  cursor: pointer;
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
.loading {
  filter: blur(5px);
}
</style>
<style>
.select-group {
  box-shadow: 0 0 5px 5px rgba(50, 50, 50, 0.3) !important;
  background: #bbbbbb55 !important;
}
/* 设置垂直滚动条的宽度和颜色 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: transparent;
  /* 初始状态下的透明度为0 */
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}

/* 设置滚动条上的滑块的背景色 */
::-webkit-scrollbar-thumb {
  background-color: #d6d6d6;
  border-radius: 5px;
  border: 1px solid transparent;
  /* 初始状态下的背景色为灰色 */
  background-color: #b9b9b9;
  transition: background-color 0.2s ease-in-out;

  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

/* 设置滚动条的轨道的背景色 */
::-webkit-scrollbar-track {
  background-color: #aaaaaa88;
  border-radius: 5px;
  border: 1px solid transparent;
}
/* 当鼠标移动到滚动条上时，设置滚动条的颜色 */
::-webkit-scrollbar-thumb:hover {
  background-color: #6a6a6a;
}

::-webkit-scrollbar:hover {
  /* 鼠标悬停时的透明度为1 */
  opacity: 1;
}
::-webkit-scrollbar-thumb:active {
  /* 当滑块被拖动时，将背景色渐变为白色 */
  background-color: #fff;
}
</style>