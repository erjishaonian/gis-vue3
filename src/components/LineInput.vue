<template>
  <div class="main">
    <input/>
    <div class="line"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
input{
    outline: none;
    border: none;
    background: transparent;
    width: 100%;
    font-size: 20px;
    padding: 4px 10px;
    caret-color: #ddd;
}
.main{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.line{
    height: 2px;
    width: 100%;
    background: #555;
}
</style>