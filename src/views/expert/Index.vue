<template>
  <div class="mm-main">
    <div class="container">
        <div v-for="(item, i) in expertList" :key="i" class="item">
          <div class="row-1">
            <img v-if="item.img" :src="item.img" class="user-img" />
            <img v-else src="@/assets/img/farm.png" class="user-img" />
            <div class="colum colum-1">
              <div class="username">昵称：{{ item.username }}</div>
              <div class="username">邮箱：{{ item.email }}</div>
            </div>
            <div class="colum colum-2">
              <div class="tips">
                <div
                  v-for="(item, i) in String(item.expertTip).split('-')"
                  :key="i"
                  class="tip"
                >
                  {{ item }}
                </div>
              </div>
              <div class="school">{{ item.school }}-{{ item.education }}</div>
            </div>
          </div>
          <div class="row-3">专家介绍：{{ item.expertIntroduce }}</div>
          <div class="row-3">联系电话：{{ item.phone || '无' }}</div>
          <div class="row-3">QQ号：{{ item.qq || '无' }}</div>
          <div class="row-3">微信号：{{ item.wx || '无' }}</div>
          <div class="row-5">
            <div class="button-group">
              <Button
                :borderRadius="10"
                type="main"
                :width="'120px'"
                @click="submitExpert(item.email)"
                :padding="'10px 0'"
                >联系我</Button
              >
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import http from "@/axios";
import Button from "@/components/Button.vue";
export default {
    components: { Button },
    data(){
        return{
            expertList: []
        }
    },
    methods:{
        load(){
            http.post('/', 'expert.getZC', {}).then(res => {
                this.expertList = res.data
            })
        },
        submitExpert(email) {
            this.$emit('chat', email)
        }
    },
    created(){
        this.load()
    }
}
</script>

<style lang="scss">
.mm-main {
  position: relative;
  display: flex;
  // align-items: center;
  // justify-content: center;
  padding-top: 95px;
  width: auto;
  padding-left: 40px;
  padding-right: 40px;
  gap: 45px;
  min-height: calc(100vh - 95px);
  background-image: linear-gradient(to right bottom, #0d0320, #0f222e, #1a0c00);
  justify-content: center;
  .container{
    display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      color: #fff;
      .item {
        background: #ffffff55;
        border-radius: 10px;
        height: 220px;
        cursor: pointer;
        padding: 15px;
        transition: 0.3s;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .colum-2 {
          color: #fff;
          font-size: 15px;
          margin-left: 25px;
        }
        .colum {
            margin-top: 5px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          .tips {
            display: flex;
            gap: 4px;
            .tip {
              background: #5cb85c;
              color: #fff;
              border-radius: 4px;
              font-size: 10px;
              padding: 2px 8px;
            }
          }
        }
        .row-1 {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          .user-img {
            border-radius: 100%;
            background: #ffffffdd;
            width: 70px;
            height: 70px;
          }
        }
        .row-3,
        .row-4 {
          color: #eee;
          padding-left: 10px;
        }
        .row-5 {
          margin-top: 5px;
          display: flex;
          gap: 15px;
          position: relative;
          .button-group {
            display: flex;
            min-width: 100px;
            flex-direction: column;
            gap: 8px;
            .status {
              font-size: 14px;
              color: #555;
              text-align: center;
            }
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
      }
      .item:hover {
        background: #ffffff6a;
      }
  }
}
</style>