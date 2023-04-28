<template>
  <div class="main">
    <slot/>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.main{
    cursor: pointer;
    font-size: 18px;
    padding-top: 14px;
    padding-bottom: 14px;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, .62);
    background: #555555;
    border-radius: 10px;
}
</style>