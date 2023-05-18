<template>
  <div class="container">
    <div class="logout button-click" @click="logout">
      <div class="label">退出登录</div>
      <Edit class="icon" />
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
    <div class="right"></div>
  </div>
</template>

<script>
import CitySelect from "@/components/CitySelect.vue";
import CheckBox from "@/components/CheckBox.vue";
import http from "@/axios";
export default {
  components: { CitySelect, CheckBox },
  data() {
    return {
      userInfo: {},
      hide: false,
      edit: false,
    };
  },
  methods: {
    logout() {
      localStorage.setItem("user", null)
      localStorage.setItem("alwaysLogin", null)
      this.$router.push('index')
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
    userImgClick() {
      if (!this.edit) return;
      document.getElementById("user-img").click();
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
      let user = JSON.parse(localStorage.getItem("user"));
      http.post("/", "user.getUserInfo", user).then((res) => {
        this.userInfo = res.data;
        this.hide = this.userInfo.hide === 0 ? false : true;
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
  min-height: calc(100vh - 90px);
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
    height: 900px;
    margin-left: calc(14vw + 380px + 40px);
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
</style>
<style>
.list {
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
</style>