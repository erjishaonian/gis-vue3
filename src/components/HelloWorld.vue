<template>
  <div class="hello">
    <div class="list">
      <h1>{{ msg }}</h1>
      <h2>LineInput</h2>
      <div class="column" style="max-width: 400px">
        <LineInput v-model="value1" :icon="true" :fontSize="18" :placeholder="'姓名'" ref="shake"><UserFilled /></LineInput>
        <LineInput :label="'姓名'"/>
        <LineInput :labelShow="false"/>
      </div>
      <div class="row">
        <Button type="info" @click="button">控制台打印value1</Button>
        <Button type="error" @click="shake">输入错误shake</Button>
        <Button @click="this.value1='hello world'">赋值</Button>
      </div>
      
      <h2>Button</h2>
      <div class="row">
        <Button >normal</Button>
        </div>
      <div class="row">
        <Button type="main">main</Button>
        <Button type="primary">primary</Button>
        <Button type="info">info</Button>
        <Button type="error">error</Button>
        <Button type="success">success</Button>
        <Button type="warining">warining</Button>
      </div>
      <div class="row">
        <Button type="main" :special="{line: true}">main</Button>
        <Button type="primary" :special="{line: true}">primary</Button>
        <Button type="info" :special="{line: true}">info</Button>
        <Button type="error" :special="{line: true}">error</Button>
        <Button type="success" :special="{line: true}">success</Button>
        <Button type="warining" :special="{line: true}">warining</Button>
      </div>
      <div class="row">
        <input type="color" v-model="buttonSpecial"/>
        <Button :special="{line: true, color: buttonSpecial}">定制化</Button>
        <Button :special="{line: false, color: buttonSpecial}">定制化</Button>
      </div>

      <h2>Modal</h2>
      <div class="row">
        <Button @click="this.modalShow=true">open</Button>
        <Modal :show="modalShow" 
          @close="this.modalShow=false"
          :width="500"
          :title="'标题'"
          >
          <div class="modal-main">
            <h1>定制内容</h1>
          </div>
        </Modal>
      </div>
        
      <h2>CheckBox</h2>
      <div class="row">
        <CheckBox v-model="checkboxValue" :label="'标签'"></CheckBox>
        <CheckBox v-model="checkboxValue"></CheckBox>
        <CheckBox v-model="checkboxValue" :label="'定制化'" :color="'#42b983'"></CheckBox>
        <Button @click="this.checkboxValue=true">选中</Button>
      </div>
      
    </div>
        
  </div>
</template>

<script>
const importAll = (r) => {
  let cache = {}
  r.keys().forEach(key => cache[key] = r(key))
  return cache;
}
// 创建Context
const allFile = importAll(
  require.context("@/components/", true, /\.vue$/) 
);

// 生成待待注册组件集合
const componentsAll = {};
for (const key in allFile) {
  // console.log(key)
  if(key == './HelloWorld.vue') continue
  const element = allFile[key].default;
  componentsAll[element.name] = element;
}

export default {
  name: 'HelloWorld',
  components: {
    ...componentsAll
  },
  props: {
    msg: String
  },
  data(){
    return{
      value1: '',
      buttonSpecial: '#FF7300',
      modalShow: false,
      checkboxValue: true
    }
  },
  methods:{
    button(){
      console.log(this.value1)
    },
    shake(){
      this.$refs.shake.shake('填错啦！')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h2 {
  margin-top: 20px;
}
.list{
  padding: 20px 5vw;
  width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.hello{
  padding-top: 10px;
}
.row{
  display: flex;
  gap: 20px;
  align-items: center;
}
.column{
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.modal-main{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-main h1{
  text-align: center;
}
</style>
