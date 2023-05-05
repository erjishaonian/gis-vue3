<template>
  <div>
    <Transition name="modal">
      <div class="bk" v-show="show"></div>
    </Transition>
    <Transition name="fi">
      <div v-if="show" class="m" @click="close">
        <div
          class="main"
          id="modal-main"
          @click.stop=""
          :style="
            (width ? 'width:' + width + 'px;' : '') +
            (borderRadius
              ? 'border-radius:' + borderRadius + 'px;overflow:hidden;'
              : '') +
            'height:' +
            height +
            ';'
          "
        >
          <div class="top">
            <h2 class="title" v-if="!onlyContent">
              {{ title }}
            </h2>
            <div
              class="close"
              @click="close"
              :style="
                borderRadius ? 'border-radius:0 0' + borderRadius + 'px 0;' : ''
              "
            >
              <el-icon class="icon" :size="24"><Close /></el-icon>
            </div>
          </div>
          <slot style="flex: 1"></slot>
          <!-- <div class="buttom" v-if="!onlyContent">
                        bottom
                    </div> -->
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    show: {
      value: Boolean,
      default: false,
    },
    width: {
      value: Number,
      default: null,
    },
    height: {
      value: String,
      default: "fit-content",
    },
    onlyContent: {
      value: Boolean,
      default: false,
    },
    borderRadius: {
      value: Number,
      default: null,
    },
    title: {
      value: String,
      default: "",
    },
  },
  watch: {
    show(oldV, newV) {
      this.mShow = newV;
      if(!newV){
        document.getElementsByTagName('html')[0].style.overflow = 'hidden'
      }
      else{
        document.getElementsByTagName('html')[0].style.overflow = 'auto'
      }
      // console.log(newV)
    },
  },
  data() {
    return {
      mShow: false,
    };
  },
  created() {
    // console.log('modal created')
  },
  methods: {
    close() {
      this.mShow = false;
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.bk {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  z-index: 1099;
  width: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
  backdrop-filter: blur(4px);
}
.m {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 1100;
}
.main {
  background-color: rgba(255, 255, 255, 0.62);
  // height: 600px;
  min-height: 200px;
  z-index: 99999;
  width: 900px;
  position: fixed;
  top: 50%;
  left: 50%;
  right: 0;
  bottom: 0;
  transform: translate(-50%, -50%);
  // display: flex;
  // flex-direction: column;
  box-shadow: 0 0 20px 10px rgba($color: #ffffff, $alpha: 0.15);
  .top {
    position: relative;
    height: 50px;
    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      // background: $green-color;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      width: 50px;
      height: 50px;
      transition: 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #000000;
    }
    .close:hover {
      background: #f56c6ccc;
      color: #ffffff;
    }
    .close:hover .icon {
      animation: rotate 0.3s ease-in-out;
    }
  }
}

@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(270deg);
  }
}

.modal {
  /*添加过渡效果*/
  transition: opacity 0.5s;
}
/* 定义进入动画 */
.modal-enter-active {
  transition: opacity 0.3s;
}
.modal-enter-from {
  opacity: 0;
}
/* 定义离开动画 */
.modal-leave-active {
  transition: opacity 0.4s;
}
.modal-leave-to {
  opacity: 0;
}
/* 定义进入动画 */
.fi-enter-active {
  animation: fadeInUpS 0.5s;
}
/* 定义离开动画 */
.fi-leave-active {
  animation: fadeOutDown 0.7s;
}
@keyframes fadeInUpS {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translateY(-2%);
    transform: translateY(-2%);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>