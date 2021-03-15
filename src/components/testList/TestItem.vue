<template>
  <div class="TestItem" @click="link(id)">
    <p class="item-user-info">{{ patient.name }}/{{ patient.sex==='M'?'男':'女' }}/{{ patient.age }}岁</p>
    <div class="item-material-box">
      <div v-for="(item,index) in tubes" :key="index">
        <img v-lazy="pdfURL + item.tubeImg" alt="">
        <span>x{{ item.tubeNum }}</span>
      </div>
    </div>
    <p class="item-title van-ellipsis">{{ tradeName }}</p>
  </div>
</template>

<script>
import defaultImg from "@/assets/defaultImg.png";
import { mapState } from "vuex";
import {pdfURL} from "@/config";

export default {
  name: "TestItem",
  components: {},
  props: {
    patient: {
      require: true,
    },
    id: {
      require: true,
    },
    orders: {
      default:[],
      require: true,
    },
    tubes:{
      default:[],
      require: true,
    }
  },
  data() {
    return {
      defaultImg: defaultImg,
      pdfURL:pdfURL,
    };
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
    tradeName:function (){
      const arr = this.orders.map(item=>{
        return item.name
      })
      return arr.join('、')
    }
  },
  created() {
  },
  mounted() {},
  destroy() {},
  methods: {
    link(id) {
      this.$router.push({
        path: "/orderDetail",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.TestItem {
  background: rgba(33, 174, 195, .1);
  padding: 32px;

  .item-title{
    color: #333;
    font-size: 28px;
  }
  .item-material-box{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    >div{
      display: flex;
      align-items: center;
      margin-right: 20px;
      margin-bottom: 24px;
      >img{
        width: 80px;
        height: 80px;
        margin-right: 20px;
      }
      >span{
        color: #333;
        font-size: 24px;
      }
    }
  }
  .item-user-info{
    color: #333;
    font-size: 40px;
    margin-bottom: 40px;
    font-weight: bold;
  }

}
</style>
