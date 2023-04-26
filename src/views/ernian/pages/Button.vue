<template>
    <div class="main">
      <h1>Button</h1>
      <h3>基础使用</h3>
      <div class="row">
        <Button >normal</Button>
      </div>
      <div>
        <highlightjs language="javascript"
          :code="code1"/>
      </div>
      <h3>更多样式</h3>
      <div class="row">
        <Button type="main">main</Button>
        <Button type="primary">primary</Button>
        <Button type="info">info</Button>
        <Button type="error">error</Button>
        <Button type="success">success</Button>
        <Button type="warining">warining</Button>
      </div>
      <div>
        <highlightjs language="javascript"
          :code="code2"/>
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
      <div>
        <highlightjs language="javascript"
          :code="code3"/>
      </div>
    </div>
</template>

<script>
import Button from '@/components/Button'
export default {
    components: {Button},
    data(){
        return{
            buttonSpecial: '#FF7300',
            code1: '<Button>normal</Button>',
            code2: `<Button type="main">main</Button>
<Button type="primary">primary</Button>
<Button type="info">info</Button>
<Button type="error">error</Button>
<Button type="success">success</Button>
<Button type="warining">warining</Button>
<Button type="main" :special="{line: true}">main</Button>

<Button type="primary" :special="{line: true}">primary</Button>
<Button type="info" :special="{line: true}">info</Button>
<Button type="error" :special="{line: true}">error</Button>
<Button type="success" :special="{line: true}">success</Button>
<Button type="warining" :special="{line: true}">warining</Button>`,
            code3: `<Button :special="{line: true, color: '#FF7300'}">定制化</Button>
<Button :special="{line: false, color: '#FF7300'}">定制化</Button>`
        }
    },
}
</script>

<style>

</style>