<template>
  <div class="line-input-main">
    <div class="line-input-label" v-if="labelShowThis">{{ label }}</div>
    <div
      class="line-input-box"
      :style="{ fontSize: fontSize + 'px', animation: boxAnimation }"
    >
      <div
        class="line-input-empty-label"
        v-if="label === null && placeholder && placeholder !== ''"
        :style="{ height: fontSize * 1.4 + 'px' }"
      ></div>
      <div class="line-input-content">
        <div class="line-input-input">
          <input
            :placeholder="label === null ? '' : placeholder"
            @click="click"
            :style="{ fontSize: fontSize + 'px', color: color }"
            @focus="focus"
            @blur="blur"
            :value="value"
            @input="input"
            :type="type"
            :disabled="disabled"
            @change="change"
            :maxlength="maxLen === -1 ? '' : maxLen"
          />
          <div
            class="line-input-placeholder"
            v-if="label === null"
            :style="placeholderStyle"
          >
            {{ placeholder }}
          </div>
        </div>
        <div class="line-input-icon" v-if="icon">
          <slot />
        </div>
      </div>
      <div class="line-input-line" :style="'background: ' + lineColor">
        <Transition name="tip">
          <!-- 报错文字 -->
          <div
            class="line-input-error-tip"
            v-show="errorTipShow"
            :style="{ fontSize: fontSize * 0.7 + 'px' }"
          >
            {{ errorTip }}
          </div>
        </Transition>
        <div class="line-input-focus-line" :style="focusLineStyle"></div>
        <div class="line-input-error-line" :style="errorLineStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
function debounce(fn, delay) {
  var timeout = null; // 创建一个标记用来存放定时器的返回值
  return function (e) {
    // 每当用户输入的时候把前一个 setTimeout clear 掉
    clearTimeout(timeout);
    // 然后又创建一个新的 setTimeout, 这样就能保证interval 间隔内如果时间持续触发，就不会执行 fn 函数
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}
export default {
  name: "LineInput",
  // 注册时可以简写为驼峰
  emits: ["update:modelValue", "change"],
  computed: {
    value: {
      // 如果正常访问,返回给this.modelValue
      get() {
        return this.modelValue;
      },
      set(newV) {
        // 通过触发自定义事件的形式让父组件帮我们更新他的数据，以达到双向绑定效果
        this.$emit("update:modelValue", newV);
      },
    },
  },
  props: {
    icon: {
      value: Boolean,
      default: false,
    },
    fontSize: {
      value: Number,
      default: 16,
    },
    label: {
      value: String,
      default: null,
    },
    labelShow: {
      value: Boolean,
      default: false,
    },
    placeholder: {
      value: String,
      default: null,
    },
    placeholderColor: {
      value: String,
      default: "#888888",
    },
    color: {
      value: String,
      default: "#555555",
    },
    type: {
      value: String,
      default: "",
    },
    maxLen: {
      value: Number,
      default: -1,
    },
    lineColor: {
      value: String,
      default: "#555555",
    },
    disabled: {
      value: Boolean,
      default: false,
    },
    modelValue: String,
  },
  watch: {
    value(oldV, newV) {
      this.placeholderStyle = {
        top: "-" + this.fontSize * 1.4 + "px",
        left: "0",
        fontSize: (this.fontSize * 2) / 3 + "px",
        color: this.placeholderColor
      };
    },
  },
  data() {
    return {
      placeholderStyle: {
        top: "0",
        left: "10px",
        fontSize: this.fontSize + "px",
        color: this.placeholderColor,
      },
      boxAnimation: "",
      labelShowThis: this.labelShow,
      errorTip: "",
      errorTipShow: false,
      errorLineStyle: {
        maxWidth: "0%",
        left: 0,
        boxShadow: "0 0 5px #f56c6c00",
      },
      focusLineStyle: {
        maxWidth: "0%",
        left: 0,
        boxShadow: "0 0 5px #f56c6c00",
      },
    };
  },
  methods: {
    input(e) {
      this.value = e.target.value;
      this.$emit("change", e.target.value);
    },
    blur() {
      if (this.value === "") {
        this.placeholderStyle = {
          top: "0",
          left: "10px",
          fontSize: this.fontSize + "px",
          color: this.placeholderColor,
        };
        this.overError();
      }
      this.focusLineStyle = {
        maxWidth: "0%",
        right: 0,
        boxShadow: "0 0 5px #f56c6c00",
      };
    },
    focus() {
      if (this.value === "") {
        this.placeholderStyle = {
          top: "-" + this.fontSize * 1.4 + "px",
          left: "0",
          fontSize: (this.fontSize * 2) / 3 + "px",
          color: this.placeholderColor,
        };
      }
      this.focusLineStyle = {
        maxWidth: "100%",
        left: 0,
        boxShadow: "0 0 5px #f56c6c00",
      };
    },
    click: debounce(() => {
      // console.log('click')
    }, 1000),
    shakeOnly() {
      this.boxAnimation = "shakeX 1s";
      setTimeout(() => {
        this.boxAnimation = "";
      }, 500);
    },
    shake(tip) {
      this.errorTip = "";
      this.errorTip = tip;
      this.errorTipShow = true;
      this.boxAnimation = "shakeX 1s";
      this.errorLineStyle = {
        maxWidth: "100%",
        left: "0",
        boxShadow: "0 0 5px #f56c6c",
      };
      setTimeout(() => {
        this.boxAnimation = "";
      }, 500);
      this.shakeOver(this);
    },
    error(tip) {
      this.errorTip = "";
      this.errorTip = tip;
      this.errorTipShow = true;
      this.errorLineStyle = {
        maxWidth: "100%",
        left: "0",
        boxShadow: "0 0 5px #f56c6c",
      };
    },
    overError() {
      this.errorTipShow = false;
      this.errorLineStyle = {
        maxWidth: "0%",
        right: "0",
        boxShadow: "0 0 5px #f56c6c00",
      };
    },
    shakeOver: debounce((that) => {
      that.errorTipShow = false;
      that.errorLineStyle = {
        maxWidth: "0%",
        right: "0",
        boxShadow: "0 0 5px #f56c6c00",
      };
    }, 5000),
  },
  created() {
    if (this.value !== "") {
      this.placeholderStyle = {
        top: "-" + this.fontSize * 1.4 + "px",
        left: "0",
        fontSize: (this.fontSize * 2) / 3 + "px",
        color: this.placeholderColor,
      };
    }
    if (this.label && this.label !== "") {
      this.labelShowThis = true;
    }
  },
};
</script>

<style scoped>
input {
  outline: none;
  border: none;
  background: transparent;
  padding: 4px 10px;
  caret-color: #ddd;
  width: calc(100% - 24px);
}
.line-input-error-tip {
  color: #f56c6c;
  position: absolute;
  top: 8px;
  left: 4px;
}
.line-input-placeholder {
  position: absolute;
  transition: 0.3s;
}
.line-input-empty-label {
  width: 100%;
}
.line-input-input {
  flex: 1;
  position: relative;
}
.line-input-main {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.line-input-line {
  height: 2px;
  width: 100%;
  background: #555;
  margin-top: 4px;
  position: relative;
}
.line-input-box {
  width: 100%;
  position: relative;
}
.line-input-content {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.line-input-icon {
  width: 24px;
  display: flex;
  align-items: center;
}
.line-input-label {
  white-space: nowrap;
  padding-right: 20px;
  padding-top: 1px;
}
.line-input-focus-line {
  position: absolute;
  background: linear-gradient(to right, #000, #42b983, #418cb7, #42b983, #000);
  height: 3px;
  transition: 0.7s;
  width: 100%;
  background-position: 100% 0;
  animation: bgSize 10s infinite ease-in-out alternate;
}
@keyframes bgSize {
  0% {
    background-size: 600% 100%;
    box-shadow: 0 0 4px #418cb7;
  }
  100% {
    background-size: 100% 100%;
    box-shadow: 0 0 4px #42b983;
  }
}
.line-input-error-line {
  position: absolute;
  background: #f56c6c;
  height: 3px;
  transition: 0.7s;
  width: 100%;
}

/* 定义进入动画 */
.tip-enter-active {
  animation: zoomIn 0.1s, fadeInDown 0.2s;
}
/* 定义离开动画 */
.tip-leave-active {
  animation: zoomOut 0.3s, fadeOutUp 0.2s;
}
</style>