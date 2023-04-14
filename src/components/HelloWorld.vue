<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="list">
        <LineInput :icon="true" :fontSize="18" :placeholder="'姓名'" v-model="value1" ref="shake"><UserFilled /></LineInput>
        <LineInput :label="'姓名'"/>
        <LineInput :labelShow="false"/>
        <div class="row">
          <Button type="info" @click="button">控制台打印value1</Button>
          <Button type="error" @click="shake">输入错误shake</Button>
        </div>
        <div class="row">
          <Button>normal</Button>
          <Button type="main">main</Button>
        </div>
        <div class="row">
          <input type="color" v-model="buttonSpecial"/>
          <Button :special="{line: true, color: buttonSpecial}">定制化</Button>
          <Button :special="{line: false, color: buttonSpecial}">定制化</Button>
        </div>
        
        
        
    </div>
        
  </div>
</template>

<script>
import LineInput from '@/components/LineInput.vue'
import Button from '@/components/Button.vue'
export default {
  name: 'HelloWorld',
  components: {
    LineInput, Button
  },
  props: {
    msg: String
  },
  data(){
    return{
      value1: '',
      buttonSpecial: '#FF7300'
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
h3 {
  margin: 40px 0 0;
}
.list{
  padding: 40px;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.hello{
  padding-top: 100px;
}
.row{
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>
