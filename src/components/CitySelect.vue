<template>
  <div class="select-group">
    <div class="province select">
      <div @click.stop="openProvince(true)" class="label">
        {{ check.province }}省
      </div>
      <div class="province-list list">
        <div
          class="province-item option"
          :id="'province-' + i"
          v-for="(item, i) in data"
          :key="i"
          v-show="item.show && show.province"
          @click="provinceClick(item.name, item.id, i)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="city select">
      <div @click.stop="openCity(true)" class="label">{{ check.city }}</div>
      <div class="city-list list">
        <div
          class="city-item option"
          :id="'city-' + i"
          v-for="(item, i) in data[this.id.province].child"
          :key="i"
          v-show="item.show && show.city"
          @click="cityClick(item.name, item.id, i)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="district select">
      <div @click.stop="openDistrict(true)" class="label">
        {{ check.district }}
      </div>
      <div class="district-list list">
        <div
          class="district-item option"
          :id="'district-' + i"
          v-for="(item, i) in data[this.id.province].child[this.id.city].child"
          :key="i"
          v-show="item.show && show.district"
          @click="districtClick(item.name, item.id, i)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["change"],
  props: {
    city: {
      value: String,
      default: "吉林",
    },
    district: {
      value: String,
      default: "船营",
    },
    onlyRead: {
      value: Boolean,
      default: false,
    },
  },
  watch: {
    onlyRead(oldV, newV) {
      this.onlyReadThis = oldV
    },
    district(oldV, newV){
      this.load()
    }
  },
  data() {
    return {
      data: require("./js/city.json"),
      show: {
        province: false,
      },
      onlyReadThis: this.onlyRead,
      check: {
        province: null,
        city: null,
        district: this.district,
        id: "2679",
      },
      id: {
        province: null,
        city: null,
        district: null,
      },
    };
  },
  methods: {
    districtClick(name, id, index) {
      this.check.district = name;
      this.check.id =
        this.data[this.id.province].child[this.id.city].child[index].id;
      this.id.district = index;
      this.openDistrict();
      this.$emit("change", {
        id: id,
        province: this.check.province,
        city: this.check.city,
        district: this.check.district,
      });
    },
    cityClick(name, id, index) {
      this.check.city = name;
      this.check.district =
        this.data[this.id.province].child[index].child[0].name;
      this.check.id = this.data[this.id.province].child[index].child[0].id;
      this.id.city = index;
      this.id.district = 0;
      this.openCity();
      this.$emit("change", {
        id: id,
        province: this.check.province,
        city: this.check.city,
        district: this.check.district,
      });
    },
    provinceClick(name, id, index) {
      this.check.province = name;
      this.check.city = this.data[index].child[0].name;
      this.check.district = this.data[index].child[0].child[0].name;
      this.check.id = this.data[index].child[0].child[0].id;
      this.id.province = index;
      this.id.city = 0;
      this.id.district = 0;
      this.openProvince();
      this.$emit("change", {
        id: id,
        province: this.check.province,
        city: this.check.city,
        district: this.check.district,
      });
    },
    openDistrict(flag = false) {
      if(this.onlyReadThis) return
      this.show.district = !this.show.district;
      if (this.show.city && flag) {
        this.openCity(false);
      }
      if (this.show.province && flag) {
        this.openProvince(false);
      }

      if (this.show.district === true) {
        for (
          let i = 0;
          i < this.data[this.id.province].child[this.id.city].child.length;
          i++
        ) {
          setTimeout(
            () => {
              this.data[this.id.province].child[this.id.city].child[
                i
              ].show = true;
            },
            i * 80 > 800 ? 800 : i * 80
          );
        }
      } else {
        for (
          let i = 0;
          i < this.data[this.id.province].child[this.id.city].child.length;
          i++
        ) {
          setTimeout(
            () => {
              this.data[this.id.province].child[this.id.city].child[
                i
              ].show = false;
            },
            i * 80 > 800 ? 800 : i * 80
          );
        }
      }
    },
    openCity(flag = false) {
      if(this.onlyReadThis) return
      this.show.city = !this.show.city;
      if (this.show.district && flag) {
        this.openDistrict(false);
      }
      if (this.show.province && flag) {
        this.openProvince(false);
      }
      if (this.show.city === true) {
        for (let i = 0; i < this.data[this.id.province].child.length; i++) {
          setTimeout(
            () => {
              this.data[this.id.province].child[i].show = true;
            },
            i * 80 > 800 ? 800 : i * 80
          );
        }
      } else {
        for (let i = 0; i < this.data[this.id.province].child.length; i++) {
          setTimeout(
            () => {
              this.data[this.id.province].child[i].show = false;
            },
            i * 80 > 800 ? 800 : i * 80
          );
        }
      }
    },
    openProvince(flag = false) {
      if(this.onlyReadThis) return
      this.show.province = !this.show.province;
      if (this.show.district && flag) {
        this.openDistrict(false);
      }
      if (this.show.city && flag) {
        this.openCity(false);
      }
      if (this.show.province === true) {
        for (let i = 0; i < this.data.length; i++) {
          setTimeout(
            () => {
              this.data[i].show = true;
            },
            i * 80 > 800 ? 800 : i * 80
          );
        }
      } else {
        for (let i = 0; i < this.data.length; i++) {
          setTimeout(
            () => {
              this.data[i].show = false;
            },
            i * 80 > 800 ? 800 : i * 80
          );
        }
      }
    },
    load(){
      for (let i = 0; i < this.data.length; i++) {
      this.data[i].show = false;
      for (let j = 0; j < this.data[i].child.length; j++) {
        this.data[i].child[j].show = false;

        for (let k = 0; k < this.data[i].child[j].child.length; k++) {
          if (this.data[i].child[j].child[k].name === this.district && this.data[i].child[j].name === this.city) {
            this.id = {
              province: i,
              city: j,
              district: k,
            };
            this.check = {
              province: this.data[i].name,
              city: this.data[i].child[j].name,
              district: this.data[i].child[j].child[k].name,
              id: this.data[i].child[j].child[k].id,
            };
          }
          this.data[i].child[j].child[k].show = false;
        }
      }
    }
    document.body.onclick = () => {
      this.show.province = false;
      this.show.city = false;
      this.show.district = false;
      for (let i = 0; i < this.data.length; i++) {
        setTimeout(
          () => {
            this.data[i].show = false;
          },
          i * 80 > 800 ? 800 : i * 80
        );
      }
      for (let i = 0; i < this.data[this.id.province].child.length; i++) {
        setTimeout(
          () => {
            this.data[this.id.province].child[i].show = false;
          },
          i * 80 > 800 ? 800 : i * 80
        );
      }
      for (
        let i = 0;
        i < this.data[this.id.province].child[this.id.city].child.length;
        i++
      ) {
        setTimeout(
          () => {
            this.data[this.id.province].child[this.id.city].child[
              i
            ].show = false;
          },
          i * 80 > 800 ? 800 : i * 80
        );
      }
    };
    }
  },
  created() {
    // console.log(this.district)
    this.load()
  },
};
</script>

<style scoped lang="scss">
.select-group {
  width: 100%;
  background: #bbbbbb88;
  border-radius: 10px;
  box-shadow: 0 0 10px 10px rgba($color: #555555, $alpha: 0.3);
  height: 50px;
  display: flex;
  align-items: center;
  //   overflow: hidden;
  .select {
    flex: 1;
    text-align: center;
    font-size: 1.15rem;
    line-height: 50px;
    cursor: pointer;
    transition: 0.5s;
  }
  .province {
    border-radius: 10px 0 0 10px;
    position: relative;
  }
  .province .label{
    border-radius: 10px 0 0 10px;
  }
  .city {
    position: relative;
  }
  .district {
    border-radius: 0 10px 10px 0;
    position: relative;
  }
  .district .label{
    border-radius: 0 10px 10px 0;
  }
  .label:hover {
    background: #66666688;
  }
  .line {
    flex: none;
    width: 2px;
    background: #bbbbbb;
    height: 32px;
  }
}
.option {
  animation: fadeInRight 0.2s;
  background: #66666688;
  transition: 0.3s;
  backdrop-filter: blur(3px);
}
.option:hover {
  background: #aaaaaa88;
}
.list {
  z-index: 9999;
  position: absolute;
  top: 52px;
  left: 0;
  border-radius: 10px;
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
  backdrop-filter: blur(5px);
  width: 200px;
  //box-shadow: 0 0 10px 10px rgba($color: #555555, $alpha: 0.3);
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