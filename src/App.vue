<template>
  <div class="app-main">
    <div
      class="top"
      :style="{
        color: topStyle.color || '#eeeeee',
        background: topStyle.background,
      }"
      :class="{ bf: !isTop }"
    >
      <!-- <img class="image" src="@/assets/img/logo-white.png" @click="this.$router.push('index')"> -->
      <div class="title" @click="this.$router.push('index')">
        {{ topMenu.title }}
      </div>
      <div style="flex: 1"></div>
      <div
        v-for="(item, i) in topMenu.list"
        :key="i"
        class="router button-bottom-line"
        @click="this.$router.push(item.url)"
      >
        {{ item.name }}
      </div>
      <div style="flex: 0.5"></div>
      <div
        v-show="topMenu.loginShow"
        class="login button-bottom-line"
        @click="loginModalOpen"
        :title="isLogin ? '个人中心' : '登录'"
      >
        {{ isLogin ? userInfo.username : "登录" }}
      </div>
    </div>
    <router-view v-slot="{ Component, route }" style="min-width: 900px">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
    <Modal
      :show="loginShow"
      @close="loginClose"
      :width="600"
      :onlyContent="true"
      :borderRadius="20"
    >
      <div class="modal-main">
        <div class="title">
          <transition name="inputL">
            <div class="login-title" v-show="registerShow === 0">登录</div>
          </transition>
          <transition name="inputR">
            <div class="register-title" v-show="registerShow !== 0">注册</div>
          </transition>
        </div>
        <div class="input max-height" id="input">
          <transition name="inputL">
            <div class="email" id="email" v-show="show.email">
              <LineInput
                :icon="true"
                :placeholderColor="'#333333'"
                :fontSize="20"
                :placeholder="'邮箱'"
                v-model="user.email"
                ref="email"
                @change="emailChange"
                ><Message
              /></LineInput>
            </div>
          </transition>
          <div class="code max-height" id="code">
            <transition name="inputR">
              <div class="code-box" v-show="show.code">
                <LineInput
                  :placeholderColor="'#333333'"
                  :fontSize="20"
                  :placeholder="'验证码'"
                  v-model="repass.code"
                  :maxLen="6"
                  @change="codeChange"
                  type="password"
                  ref="code"
                ></LineInput>
              </div>
            </transition>
          </div>
          <div class="password max-height" id="password">
            <transition name="inputL">
              <div class="password-box" v-show="show.password">
                <LineInput
                  :icon="true"
                  :placeholderColor="'#333333'"
                  :fontSize="20"
                  :placeholder="'密码'"
                  v-model="user.password"
                  type="password"
                  ref="password"
                  ><Lock
                /></LineInput>
              </div>
            </transition>
          </div>
          <div class="password-0 max-height" id="password-0">
            <transition name="inputR">
              <div class="password-0-box" v-show="show.password0">
                <LineInput
                  :icon="true"
                  :placeholderColor="'#333333'"
                  :fontSize="20"
                  :placeholder="'密码'"
                  v-model="repass.password0"
                  type="password"
                  ref="password0"
                  ><Lock
                /></LineInput>
              </div>
            </transition>
          </div>
          <div class="password-1 max-height" id="password-1">
            <transition name="inputR">
              <div class="password-1-box" v-show="show.password1">
                <LineInput
                  :icon="true"
                  :placeholderColor="'#333333'"
                  :fontSize="20"
                  :placeholder="'确认密码'"
                  v-model="repass.password1"
                  type="password"
                  ref="password1"
                  ><Lock
                /></LineInput>
              </div>
            </transition>
          </div>
        </div>
        <div class="check max-height" id="check">
          <transition name="inputL">
            <div class="check-box" v-show="show.check">
              <div class="container">
                <CheckBox
                  v-model="remember"
                  :label="'记住我'"
                  :color="'#555555'"
                ></CheckBox>
              </div>
              <div class="empty"></div>
              <div class="container">
                <CheckBox
                  v-model="alwaysLogin"
                  :label="'保持登录'"
                  :color="'#555555'"
                ></CheckBox>
              </div>
            </div>
          </transition>
        </div>
        <div class="button" id="button">
          <div class="login" id="login">
            <Button
              :borderRadius="10"
              :transition="'.3s'"
              :width="'auto'"
              :special="{ line: false, color: '#555555' }"
              :padding="'12px 16px'"
              @click="login"
              id="login-button"
            >
              <transition-group name="page">
                <div style="color: rgba(0, 0, 0, 0)">占位</div>
                <div class="button-label" v-show="registerShow === 0" :key="0">
                  登录
                </div>
                <div class="button-label" v-show="registerShow === 1" :key="1">
                  返回
                </div>
                <div class="button-label" v-show="registerShow === 2" :key="2">
                  上一步
                </div>
                <div class="button-label" v-show="registerShow === 3" :key="3">
                  上一步
                </div>
              </transition-group>
            </Button>
          </div>
          <div class="register" id="register">
            <Button
              :borderRadius="10"
              :transition="'.3s'"
              :width="'auto'"
              :special="{ line: true, color: '#555555' }"
              :padding="'12px 16px'"
              @click="register"
              id="register-button"
            >
              <transition-group name="page">
                <div style="color: rgba(0, 0, 0, 0)">占位</div>
                <div class="button-label" v-show="registerShow === 0" :key="0">
                  注册
                </div>
                <div class="button-label" v-show="registerShow === 1" :key="1">
                  发送验证码
                </div>
                <div class="button-label" v-show="registerShow === 2" :key="2">
                  确认
                </div>
                <div class="button-label" v-show="registerShow === 3" :key="3">
                  注册
                </div>
              </transition-group>
            </Button>
          </div>
        </div>
        <div class="empty"></div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import router from "./router/index.js";
import "@/assets/untils/button.bottom.line.css";
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";
import CheckBox from "@/components/CheckBox.vue";
import LineInput from "@/components/LineInput.vue";
import { throttle } from "@/assets/untils/untils.js";
import http from "@/axios";

export default defineComponent({
  name: "App",
  components: {
    Modal,
    LineInput,
    Button,
    CheckBox,
  },
  data() {
    return {
      transitionName: "page",
      loginShow: false,
      registerShow: 0,
      //记住我
      remember: true,
      //保持登录
      alwaysLogin: true,
      //form
      user: {
        email: "",
        password: "",
      },
      userInfo: {},
      //form
      repass: {
        code: "",
        password0: "",
        password1: "",
      },
      //顶部栏样式
      topStyle: {
        color: null,
        background: null,
      },
      //顶部栏是否置顶
      isTop: false,
      //登录弹窗
      show: {
        email: true,
        password: true,
        check: true,
        registerButton: true,
        code: false,
        password0: false,
        password1: false,
      },
      //是否已经登录
      isLogin: false,
      topMenu: {
        title: "智慧农业",
        url: "/index",
        list: [
          {
            name: "地图展示",
            url: "/gis",
          },
          {
            name: "气象预警",
            url: "/weather",
          },
          {
            name: "专家指导",
            url: "/index",
          },
        ],
        loginShow: true,
      },
    };
  },
  created() {
    // 监听路由变化，更新transitionName
    router.afterEach((to, from) => {
      // console.log(to);
      if (to.path === "/index") {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user === null) {
          this.isLogin = false;
          this.topMenu = {
            title: "智慧农业",
            url: "/index",
            list: [
              {
                name: "地图展示",
                url: "/gis",
              },
              {
                name: "气象预警",
                url: "/weather",
              },
              {
                name: "专家指导",
                url: "/index",
              },
            ],
            loginShow: true,
          };
        }
      }
      if (to.meta && to.meta.topMenu) {
        this.topMenu = to.meta.topMenu;
      }
      if (to.meta && to.meta.topStyle) this.topStyle = to.meta.topStyle;
      else
        this.topStyle = {
          color: "#eeeeee",
          background: "#000000",
          keep: "none",
        };
      this.topTrandorm();
    });
    //自动登录
    if (!this.isLogin && localStorage.getItem("alwaysLogin") === "true") {
      let user = JSON.parse(localStorage.getItem("user"));
      http.post("/", "user.login", user).then((res) => {
        // console.log(res)

        if (res.status === 200) {
          this.userInfo = res.data;
          this.isLogin = true;
          // this.$message.success("自动登录成功！");
          if (this.userInfo.role === "管理员") {
            this.topMenu.list.push({
              name: "OA审批",
              url: "/oa",
            });
          }
        }
      });
    }
  },
  mounted() {
    // this.topTrandorm()
    //节流 100内执行一次
    window.addEventListener("scroll", throttle(this.topTrandorm, 100));
  },
  unmounted() {
    window.removeEventListener("scroll");
  },
  methods: {
    login() {
      //登录
      if (this.registerShow === 0) {
        const regEmail =
          /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (this.user.email === "") {
          this.$refs.email.shake("请填写邮箱");
          return;
        } else if (!regEmail.test(this.user.email)) {
          this.$refs.email.shakeOnly();
          return;
        }
        if (this.user.password === "") {
          this.$refs.password.shake("请填写密码");
          return;
        }
        //记住我
        if (this.remember) {
          console.log("存储用户信息");
          localStorage.setItem("user", JSON.stringify(this.user));
        }
        http.post("/", "user.login", this.user).then((res) => {
          if (res.status === 200) {
            this.userInfo = res.data;
            this.isLogin = true;
            this.loginShow = false;
            localStorage.setItem("alwaysLogin", this.alwaysLogin);
            this.$message.success("登录成功！");
            if (this.userInfo.role === "管理员") {
              this.topMenu.list.push({
                name: "OA审批",
                url: "/oa",
              });
            }
          } else if (res.status === 501) {
            this.$refs.password.shake(res.msg);
          } else if (res.status === 502) {
            this.$refs.email.shake(res.msg);
            return;
          }
        });
      }
      //注册转登录
      else if (this.registerShow === 1) {
        //设置高度
        let passwordDiv = document.getElementById("password");
        let passwordH = passwordDiv.style.height;
        let checkDiv = document.getElementById("check");
        let checkH = checkDiv.style.height;
        passwordDiv.style.maxHeight = passwordH;
        checkDiv.style.maxHeight = checkH;
        document.getElementById("login").style.flex = "1";
        document.getElementById("register").style.flex = "0.5";
        //打开密码和check区
        setTimeout(() => {
          this.show.password = true;
        }, 150);
        setTimeout(() => {
          this.show.check = true;
        }, 350);
        this.registerShow = 0;
      }
      //验证码上一步
      else if (this.registerShow === 2) {
        this.show.code = false;
        this.show.email = true;
        //打开密码和check区
        this.registerShow = 1;
      }
      //注册密码上一步
      else if (this.registerShow === 3) {
        this.show.code = true;
        //设置高度
        let password0Div = document.getElementById("password-0");
        let password1Div = document.getElementById("password-1");
        password0Div.style.maxHeight = "0";
        password1Div.style.maxHeight = "0";
        let checkDiv = document.getElementById("check");
        checkDiv.style.maxHeight = "0";
        setTimeout(() => {
          this.show.password0 = false;
        }, 200);
        setTimeout(() => {
          this.show.password1 = false;
        }, 250);
        setTimeout(() => {
          this.show.check = false;
        }, 300);
        //打开密码和check区
        this.registerShow = 2;
      }
    },
    register() {
      //登录转注册
      if (this.registerShow === 0) {
        //固定高度，防止出现高度抖动
        let passwordDiv = document.getElementById("password");
        let passwordH = passwordDiv.clientHeight;
        passwordDiv.style.height = passwordH + "px";
        passwordDiv.style.maxHeight = passwordH + "px";
        let checkDiv = document.getElementById("check");
        let checkH = checkDiv.clientHeight;
        // checkDiv.style.height = checkH + "px";
        checkDiv.style.maxHeight = checkH + "px";
        //隐藏密码和check区
        this.show.password = false;
        setTimeout(() => {
          this.show.check = false;
        }, 200);
        //设置最大高度，做到动画效果
        setTimeout(() => {
          passwordDiv.style.maxHeight = "0";
          checkDiv.style.maxHeight = "0";
        }, 250);
        //改变按钮样式
        document.getElementById("login").style.flex = "0.5";
        document.getElementById("register").style.flex = "1";
        //下一步
        this.registerShow = 1;
      }
      //发送验证码
      else if (this.registerShow === 1) {
        const regEmail =
          /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (this.user.email === "") {
          this.$refs.email.shake("请填写邮箱");
          return;
        } else if (!regEmail.test(this.user.email)) {
          this.$refs.email.shakeOnly();
          return;
        }
        //发送验证码
        else {
          http
            .post("/", "user.sendCode", { email: this.user.email })
            .then((res) => {
              if (res.status !== 200) {
                this.$refs.email.shake(res.msg);
                return;
              }
              this.$message.success("发送成功！");
              //执行动画
              //固定高度，防止出现高度抖动
              let emailDiv = document.getElementById("email");
              let emailH = emailDiv.clientHeight;
              emailDiv.style.height = emailH + "px";
              emailDiv.style.maxHeight = emailH + "px";
              //隐藏邮箱
              this.show.email = false;
              //打开验证码
              this.show.code = true;
              //下一步
              this.registerShow = 2;
            })
            .catch((e) => {
              this.$refs.email.shake("验证码发送失败");
            });
        }
      }
      //注册最后一步
      else if (this.registerShow === 2) {
        const codeInfo = {
          email: this.user.email,
          code: this.repass.code,
        };
        http.post("/", "user.code", codeInfo).then((res) => {
          if (res.status !== 200) {
            this.$refs.code.shake(res.msg);
            return;
          }
          //设置高度
          let password0Div = document.getElementById("password-0");
          let password1Div = document.getElementById("password-1");
          password0Div.style.maxHeight = "70px";
          password1Div.style.maxHeight = "75px";
          password0Div.style.height = "70px";
          password1Div.style.height = "75px";
          let checkDiv = document.getElementById("check");
          checkDiv.style.maxHeight = "100px";
          checkDiv.style.height = "73px";
          this.show.code = false;
          //打开密码和check区
          setTimeout(() => {
            this.show.password0 = true;
          }, 350);
          setTimeout(() => {
            this.show.password1 = true;
          }, 450);
          setTimeout(() => {
            this.show.check = true;
          }, 550);
          this.registerShow = 3;
        });
      } else if (this.registerShow === 3) {
        const registerInfo = {
          email: this.user.email,
          password: this.repass.password0,
        };
        if (this.repass.password0 !== this.repass.password1) {
          this.$refs.password0.shake("");
          this.$refs.password.shake("两次输入不一致");
          return;
        }
        http.post("/", "user.registerPassword", registerInfo).then((res) => {
          if (res.status !== 200) {
            this.$refs.code.shake(res.msg);
            return;
          }
          this.user.password = this.repass.password1;
          //记住我
          if (this.remember) {
            console.log("存储用户信息");
            localStorage.setItem("user", JSON.stringify(this.user));
          }
          this.isLogin = true;
          this.$message.success("注册成功并登录");
          this.loginShow = false;
        });
      }
    },
    //监听用户输入邮箱时间
    emailChange(e) {
      const regEmail =
        /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      let resResult = regEmail.test(e);
      if (resResult) {
        this.$refs.email.overError();
      } else {
        this.$refs.email.error("邮箱格式有误");
      }
    },
    codeChange(e) {
      if (String(e).length === 6) {
        this.register();
      }
    },
    //打开登陆弹窗
    loginModalOpen() {
      if (this.isLogin) {
        this.$router.push("user");
        return;
      }
      //记住我？
      let user = JSON.parse(localStorage.getItem("user"));
      let alwaysLogin = localStorage.getItem("alwaysLogin");
      if (user) {
        this.user = user;
        this.remember = true;
      }
      if (alwaysLogin) {
        this.alwaysLogin = localStorage.getItem("alwaysLogin");
      }
      this.registerShow = 0;
      this.loginShow = true;
      this.show = {
        email: true,
        password: true,
        check: true,
        registerButton: true,
        code: false,
        password0: false,
        password1: false,
      };
    },
    //关闭登录弹窗
    loginClose() {
      this.loginShow = false;
    },
    //顶部菜单状态变化
    topChange(e) {
      //置顶
      if (e) {
        this.topStyle.background =
          this.topStyle.background.substring(0, 7) + "00";
      }
      //未置顶
      else {
        this.topStyle.background =
          this.topStyle.background.substring(0, 7) + "bb";
      }
    },
    //监听滚动条
    topTrandorm() {
      let scrollPosition = window.pageYOffset;
      if (scrollPosition > 20) {
        if (!this.isTop) return;
        this.isTop = false;
        this.topChange(false);
      } else if (scrollPosition <= 20) {
        this.isTop = true;
        this.topChange(true);
      }
      return;
    },
  },
});
</script>


<style lang="scss" scoped>
#app {
  font-family: "黑体";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.app-main {
  background: #333;
}
.top {
  height: 90px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  // backdrop-filter: blur(3px);
  min-width: 900px;
  flex-direction: row;
  z-index: 999;
  align-items: center;
  .image {
    // width: 80px;
    height: 60px;
    margin-left: 20px;
    cursor: pointer;
  }
  .title {
    font-size: 26px;
    font-weight: bold;
    padding-left: 20px;
    cursor: pointer;
  }
  .router {
    font-size: 20px;
    margin-left: 30px;
  }
  .login {
    font-size: 18px;
    margin-right: 50px;
  }
  .router,
  .login {
    height: 32px;
  }
}
.bf {
  backdrop-filter: blur(3px);
}
.modal-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  .title {
    color: #555;
    font-size: 36px;
    font-weight: bolder;
    position: relative;
    div {
      position: absolute;
      top: 0;
      left: -36px;
      white-space: nowrap;
    }
  }
  .input {
    margin-top: 70px;
    width: 60%;
    display: flex;
    flex-direction: column;
    min-height: 95px;
    .password {
      margin-top: 30px;
    }
    .code {
      position: absolute;
      width: 60%;
    }
    .password-1 {
      height: 70px;
      max-height: 0;
    }
    .password-2 {
      height: 75px;
      max-height: 0;
    }
    .password-1-box {
      margin-top: 10px;
    }
  }
  .check {
    margin-top: 40px;
    width: 60%;
    .check-box {
      display: flex;
      .empty {
        flex: 1;
        height: auto !important;
      }
    }
    .container {
      width: fit-content;
    }
  }
  .button {
    margin-top: 20px;
    width: 60%;
    display: flex;
    gap: 20px;
    // margin-bottom: 20px;
    .login {
      flex: 1;
      transition: 0.5s ease-out;
    }
    .register {
      flex: 0.5;
      transition: 0.5s ease-out;
    }
    .button-label {
      position: absolute;
      transition: 0.5s ease-out;
    }
  }
  .empty {
    height: 80px;
  }
}
* {
  margin: 0;
  padding: 0;
}
</style>
<style>
.el-message--success {
  background: #529b2e88 !important;
}
.el-message--error {
  background: #c4565688 !important;
}
.el-message {
  backdrop-filter: blur(2px);
  border-radius: 0 !important;
  /* padding: 10px 20px !important; */
}
.el-message .el-icon {
  color: #fff !important;
}
.el-message .el-message__content {
  color: #fff !important;
}
</style>
<style>
/* 定义进入动画 */
.inputL-enter-active {
  animation: fadeInLeft 0.5s;
}
/* 定义离开动画 */
.inputL-leave-active {
  animation: fadeOutLeft 0.5s;
}
/* 定义进入动画 */
.inputR-enter-active {
  animation: fadeInRight 0.5s;
}
/* 定义离开动画 */
.inputR-leave-active {
  animation: fadeOutRight 0.5s;
}
.max-height {
  transition: max-height 0.5s ease-out;
}
</style>