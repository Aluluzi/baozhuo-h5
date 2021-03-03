<template>
  <div class="getOrder">
    <van-tabs
        v-model="tab_active"
        :line-height="0"
        title-active-color="#21AEC3"
        title-inactive-color="#333"
        type="card"
        color="#D3EFF3"
        background="#fff"
        @change="chooseLab"
    >
      <van-tab :title="x.name" v-for="(x,index) in tab_list" :key="index" >
        <labList :labId="x.id" :orderGoodsList="orderGoodsList" @check="_check"/>
      </van-tab>
    </van-tabs>

    <div class="float-box">
      <div class="float-logo-box" @click="show=true">
        <i class="float-logo"/>
        <span class="float-logo-num">{{orderGoodsList.length}}</span>
      </div>
      <div class="cart-box">
        <p class="cart-price">￥{{allPrice/100}}</p>
        <p class="cart-title">价格总和</p>
      </div>
      <p class="cart-btn" @click="next()">下一步</p>
    </div>

    <van-popup v-model="show" position="bottom">
      <div class="popup-box">
        <div class="popup-main">
          <p class="order-top-info van-hairline--bottom">
            <span class="order-top-title">添加订单</span>
            <span class="order-top-slogn">共<span class="order-num">{{ orderGoodsList.length }}</span>个项目</span>
          </p>
          <div class="order-goods">
            <div class="order-goods-item" v-for="(item,index) in orderGoodsList" :key="index">
              <i class="order-goods-item-check" :class="item.isCheck?'active':''" @click="setCheck(item,index)"></i>
              <span class="order-goods-item-name van-ellipsis">{{ item.name }}</span>
              <span class="order-goods-item-price"><span>￥</span>{{ item.price/100 }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>

import labList from '@/components/order/labList'
import {getLabList} from "./../../api/index";
import store from "@/store";

export default {
  name: "getOrder",
  data() {
    return {
      activeKey: 0, //分类导航的索引值

      tab_active: 0,
      tab_list: [],
      categoryList: [],
      category_id: null, //分类id
      // orderNo,
      page_no: 1,
      page_size: 10,
      // status: "",


      right_srcoll_value: 0,
      classifyId: null, //路由带过来的id


      show: false,
      orderGoodsList: []
    };
  },
  components: {
    labList
  },
  created() {
  },
  mounted() {
    this.getLabList()
  },
  computed: {
    allPrice:function(){
      let price = 0;
      for(let k of this.orderGoodsList){
        price += +k.price
      }
      return price
    }
  },
  watch: {
    orderGoodsList(val){
    }
  },
  methods: {

    reset() {
      this.list = [];
      this.page_no = 1;
      this.loading = true;
      this.finished = false;
      this.finishedText = "";
      this.nodata = false;
    },
    getLabList() {
      getLabList({
        // size: 10,
        status: '1'
      }).then(res => {
        if (res) {
          this.tab_list = res.map(item => {
            return {
              name: item.name,
              id: item.id
            }
          })
        }
      })
    },
    chooseLab(id){
    },
    _check(data){
      if(data){
        this.orderGoodsList = data.checkList
      }
    },
    setCheck(item,index){
      item.isCheck=!item.isCheck
      this.orderGoodsList.splice(index,1)
    },
    next(){
      store.dispatch("saveOrderList", this.orderGoodsList);
      this.$router.push({
        path:'/editCode',
        query:{
          type:1//1医生下单，2业务员编辑
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.getOrder {



  .float-box {
    width: 686px;
    height: 88px;

    border-radius: 50px;
    background-color: #000;
    position: fixed;
    bottom: 135px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    z-index: 9999;

    .float-logo-box {
      //position: absolute;
      //left: 60px;
      //bottom: 11px;
      margin-left: 60px;
      position: relative;
      bottom: 11px;

      .float-logo {
        width: 92px;
        height: 92px;
        background-image: url("../../assets/cart-logo.png");
        background-size: 100% 100%;
        display: inline-block;
        border: none;
      }

      .float-logo-num {
        background: #ff0000;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        width: 40px;
        height: 40px;
        color: #fff;
        font-size: 24px;
        font-style: initial;

        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -10px;
      }
    }

    .cart-box {
      margin-left: 42px;

      .cart-price {
        font-size: 38px;
        color: #fff;
      }

      .cart-title {
        font-size: 18px;
        color: #ADB6BA;
      }
    }

    .cart-btn {
      background: #21AEC3;
      border-radius: 0 50px 50px 0;
      position: absolute;
      right: 0;
      width: 160px;
      height: 88px;
      text-align: center;
      line-height: 88px;
      color: #fff;
      font-size: 28px;
    }
  }

  .popup-box {
    background: #fff;
    padding-bottom: 260px;

    .popup-main {
      height: 600px;
      background: #fff;
      overflow: hidden;

      .order-top-info {
        height: 96px;
        line-height: 96px;
        padding-left: 32px;

        .order-top-title {
          color: #333;
          font-size: 32px;
          margin-right: 16px;
        }

        .order-top-slogn {
          color: #9D9D9D;
          font-size: 24px;

          .order-num {
            color: #21AEC3;
          }
        }
      }

      .order-goods {
        height: 490px;
        overflow: auto;
        padding: 32px;

        .order-goods-item {
          display: flex;
          align-items: center;
          background: #F7F8FA;
          height: 88px;
          padding: 0 32px;
          margin-bottom: 16px;

          .order-goods-item-check {
            width: 32px;
            height: 32px;
            background-size: 100% 100%;
            background-image: url("../../assets/btn-check.png");
            margin-right: 40px;
          }

          .order-goods-item-check.active {
            background-image: url("../../assets/btn-check-active.png");
          }

          .order-goods-item-name {
            color: #333;
            font-size: 32px;
            margin-right: auto;
          }

          .order-goods-item-price {
            color: #21AEC3;
            font-size: 32px;

            > span {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
}
</style>