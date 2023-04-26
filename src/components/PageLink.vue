<template>
  <div class="page-link-main" :style="{color: color}" @click="linkClick">
    <slot></slot>
    <div class="page-link-line" v-show="lineShow" :style="{background: color}"></div>
  </div>
</template>

<script>
export default {
    props: {
        color: {
            value: String,
            defalue: '#333333'
        },
        lineShow: {
            value: Boolean,
            default: true
        },
        link: {
            value: String,
            default: null
        }
    },
    methods: {
        linkClick(){
            if(this.link === null) return
            console.log(this.link)
        }
    }
}
</script>
<style>
.page-link-main{
    width: fit-content;
    cursor: pointer;
}
.page-link-main:hover .page-link-line{
    width: 100%;
    margin-left: 0;
}
.page-link-line{
    height: 1px;
    width: 0%;
    margin-left: 50%;
    transition: .3s;
    
}

</style>