<template>
  <div class="chat-main">
    <div class="chat-list">
      <div
        @click="openChat(i, item)"
        v-for="(item, i) in userList"
        :key="i"
        class="item button-click"
        :class="{ 'item-in': chatIndex === i }"
        :title="item.username"
      >
        <div class="img">
          <img v-if="item.img" :src="item.img" class="user-img" />
          <img v-else src="@/assets/img/farm.png" class="user-img" />
        </div>

        <div class="tip-point" v-show="!item.read"></div>
      </div>
    </div>
    <Modal
      :title="modalTitle"
      :show="chatModalShow"
      @close="chatModalClose"
      style="pointer-events: auto"
      :borderRadius="20"
      :width="700"
    >
      <div class="chat-modal-main">
        <div class="chat" id="chat">
          <div
            v-for="(item, i) in chatData.chat"
            :key="i"
            class="item"
            :class="item.float"
          >
            <div class="img">
              <img v-if="item.chatImg" :src="item.chatImg" class="user-img" />
              <img v-else src="@/assets/img/farm.png" class="user-img" />
            </div>
            <div class="content">
              {{ item.content }}
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <LineInput
              v-model="chatInput"
              :labelShow="false"
              :fontSize="20"
            ></LineInput>
          </div>
          <div class="right">
            <Button type="main" :width="'100%'" @click="send">发送</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";
import LineInput from "@/components/LineInput.vue";
import io from "socket.io-client";

import http from "@/axios";
export default {
  components: {
    Modal,
    LineInput,
    Button,
  },
  data() {
    return {
      userList: [],
      chatIndex: null,
      chatModalShow: false,
      chatData: {
        chat: [],
      },
      id: null,
      modalTitle: "聊天",
      userInfo: {},
      chatInput: "",
      socket: null,
      setEmail: "",
      setImg: null,
      chatId: null,
    };
  },
  methods: {
    send() {
      if (this.chatInput === "") {
        return;
      }
      let sendData = {
        type: "chat",
        data: {
          content: this.chatInput,
          set_user: this.userInfo.email,
          get_user: this.setEmail,
          chat_id: this.chatId,
        },
      };
      this.socket.send(JSON.stringify(sendData));
      // this.socket.send("ni")
      let chat = {
        float: "right",
        content: this.chatInput,
        chatImg: this.userInfo.img,
      };
      this.chatData.chat.push(chat);
      this.chatInput = "";
      setTimeout(() => {
        this.chatToBottom();
      }, 300);
    },
    chatToBottom() {
      let chatDiv = document.getElementById("chat");
      chatDiv.scrollTop = chatDiv.scrollHeight;
    },
    createChat(email) {
      // console.log('create chat ' + email)
      let userList = this.userList;
      let chatHasFlag = false;
      for (let i = 0; i < userList.length; i++) {
        if (email === userList[i].email) {
          console.log("会话已存在");
          chatHasFlag = true;
          break;
        }
      }
      this.setEmail = email;
      if (chatHasFlag) {
        //会话存在
        this.load(true, email);
      } else {
        //创建新会话
        http
          .post("/", "chat.createChat", {
            set_user: this.userInfo.email,
            get_user: email,
          })
          .then((res) => {
            if (res.status === 200) {
              this.load(true, email);
            } else {
              throw new Error();
            }
          })
          .catch((e) => {
            this.$message.error("创建会话失败！");
          });
      }
    },
    openChat(i, item) {
      this.setEmail = item.email;
      this.setImg = item.img;
      // console.log(item)
      this.chatId = item.chat_id;
      this.chatIndex = i;
      this.chatModalShow = true;
      let data = this.userList[i];
      this.modalTitle = data.username;
      for (let i = 0; i < data.chat.length; i++) {
        if (data.chat[i].get_user === this.id) {
          data.chat[i].float = "left";
          data.chat[i].chatImg = data.img;
        } else {
          data.chat[i].float = "right";
          data.chat[i].chatImg = this.userInfo.img;
        }
      }
      if(!item.read){
        http.post('/', 'chat.read', {id: this.chatId}).then(res => {
          if (res.status === 200) {
              this.userList[i].read = true
            }
        })
      }
      if (data.get_user === this.id) {
        //当前用户是接受人
      } else {
        //当前用户是发送人
      }
      this.chatData = data;
      setTimeout(() => {
        this.chatToBottom();
      }, 300);
    },
    chatModalClose() {
      this.chatModalShow = false;
      this.chatIndex = null;
    },
    load(open = false, email = null) {
      let user = JSON.parse(localStorage.getItem("user-info"));
      
      if (user && user.email) {
        http.post("/", "user.getUserInfo", user).then((userRes) => {
          this.userInfo = userRes.data;
          http.post("/", "chat.getList", { email: user.email }).then((res) => {
            // console.log(res.data.list)
            this.id = res.data.id[0].id;
            let openId = null;
            for (let i = 0; i < res.data.list.length; i++) {
              res.data.list[i].read = true;
              for (let j = 0; j < res.data.list[i].chat.length; j++) {
                if (
                  res.data.list[i].chat[j].get_user === res.data.id[0].id &&
                  res.data.list[i].chat[j].status === "已发送"
                ) {
                  res.data.list[i].read = false;
                  console.log("找到一条未读消息");
                }
              }
              if (res.data.list[i].email === email) {
                openId = i;
              }
            }
            this.userList = res.data.list;
            if (open) {
              this.openChat(openId, this.userList[openId]);
            }
          });
        });
      }
    },
  },
  created() {
    this.load();
  },
  mounted() {
    if (typeof WebSocket != "function") {
      console.log(
        "您的浏览器不支持Websocket通信协议，请更换浏览器为Chrome或者Firefox再次使用！"
      );
    }

    let socket = new WebSocket("ws://localhost:3301");
    socket.addEventListener("open", () => {
      console.log("已连接");
      socket.send("123");
    });

    socket.addEventListener("message", (event) => {
      console.log("前端收到信息");
      console.log(event);
      let data = null;
      if (event.data) {
        data = JSON.parse(event.data);
        console.log(data);
      }
      if (data.type === "chat") {
        if (data.data.get_user === this.userInfo.email) {
          if (this.chatModalShow) {
            //弹窗打开
            let chat = {
              float: "left",
              content: data.data.content,
              chatImg: this.setImg,
            };
            this.chatData.chat.push(chat);
            http.post('/', 'chat.read', {id: data.data.chat_id})
            setTimeout(() => {
              this.chatToBottom();
            }, 300);
          } else {
            this.load();
          }
        }
      }
      // this.messages.push(event.data);
    });

    socket.addEventListener("close", () => {
      console.log("Disconnected from WebSocket server");
    });
    this.socket = socket;
  },
};
</script>

<style>
/* 在最新版本的Chrome浏览器中需要加上这条样式以生效 */
html {
  scroll-behavior: smooth;
}
</style>
<style lang="scss" scoped>
.chat-modal-main {
  max-height: 700px;
  .chat {
    // display: flex;
    // flex-direction: column;
    // gap: 20px;
    padding: 40px 0 40px 0;
    width: 100%;
    height: 320px;
    overflow-y: auto;
    scroll-behavior: smooth; /* 指定滚动行为为平滑滚动 */
    .item + .item {
      margin-top: 20px;
    }
    .item {
      position: relative;
      height: 50px;
      .img {
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        overflow: hidden;
        top: 0;
        background: #ffffff66;
        box-shadow: 0 0 5px 5px rgba($color: #999999, $alpha: 0.3);
        img {
          height: 50px;
          width: 50px;
        }
      }
      .content {
        top: 5px;
        position: absolute;
        background: #ffffff66;
        border-radius: 10px;
        padding: 10px 15px;
        box-shadow: 0 0 5px 5px rgba($color: #999999, $alpha: 0.3);
      }
    }
    .left {
      .img {
        left: 20px;
      }
      .content {
        left: 90px;
      }
    }
    .right {
      .img {
        right: 20px;
      }
      .content {
        right: 90px;
      }
    }
  }
  .bottom {
    height: 60px;
    display: flex;
    gap: 40px;
    padding: 20px 100px 0 100px;
    background: #ffffff33;
    .left {
      flex: 1;
    }
    .right {
      width: 100px;
    }
  }
}
.chat-main {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
  .chat-list {
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80%;
    gap: 30px;
    margin-left: -50px;
    .item {
      background: #ffffffaa;
      border-radius: 25px;
      box-shadow: 0 0 5px 5px rgba($color: #000000, $alpha: 0.5);
      transition: 0.5s;
      cursor: pointer;
      pointer-events: auto;
      position: relative;
      .img {
        overflow: hidden;
        width: 70px;
        height: 70px;
        border-radius: 25px;
        .user-img {
          width: 70px;
          height: 70px;
          object-fit: cover;
        }
      }
      .tip-point {
        position: absolute;
        top: 2px;
        right: 2px;
        background: #f55;
        width: 10px;
        height: 10px;
        border-radius: 100%;
      }
    }
    .item-in {
      margin-left: 50px;
    }
    .item:hover {
      margin-left: 50px;
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
/* 设置滚动条上的滑块的背景色 */
::-webkit-scrollbar-thumb {
  border: 1px solid rgba(102, 102, 102, 0.575);
}
/* 设置滚动条的轨道的背景色 */
::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
  border-radius: 5px;
  border: 1px solid transparent;
}
/* 当鼠标移动到滚动条上时，设置滚动条的颜色 */
::-webkit-scrollbar-thumb:hover {
  background-color: #6a6a6a;
}
/* 设置垂直滚动条的宽度和颜色 */
::-webkit-scrollbar {
  background-color: transparent;
}
</style>