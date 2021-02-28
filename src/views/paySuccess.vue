<template>
  <div class="paySuccess">
    <img class="pay-logo" :src="paySuccessImg" alt />
    <p class="pay-content">
      <span class="pay-content-title">成功支付</span>
      <span class="pay-content-price" v-if="tokenInfo.show_real_price"
        >￥{{ price | formatMoney }}</span
      >
      <span class="pay-content-price" v-else
        >￥{{ oldPrice | formatMoney }}</span
      >
    </p>
    <p class="pay-content-title">如有疑问请联系客服400-926-0012</p>

    <div class="btn go-on-btn" @click="placeOrder">继续下单</div>
    <div class="btn look-order-btn" @click="goOrder">查看订单</div>
  </div>
</template>

<script>
import paySuccessImg from "@/assets/paySuccessImg.png";
import { mapState } from "vuex";
export default {
  name: "paySuccess",
  components: {},
  data() {
    return {
      paySuccessImg,
      price: 0,
      oldPrice: 0,
      order_id: "",
    };
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
  },
  created() {
    this.price = this.$route.query.price;
    this.oldPrice = this.$route.query.oldPrice;
    this.order_id = this.$route.query.order_id;
  },
  mounted() {},
  destroy() {},
  methods: {
    //继续下单
    placeOrder() {
      this.$router.go(-1);
    },
    //查看订单详情
    goOrder() {
      this.$router.replace({
        path: "/orderDetail",
        query: {
          id: this.order_id,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.paySuccess {
  background: #fff;
  height: 100vh;
  padding-top: 140px;
}
.pay-logo {
  width: 108px;
  height: 108px;
  display: block;
  margin: 0 auto 30px;
}
.pay-content {
  text-align: center;
  font-size: 40px;
  letter-spacing: 0;
  .pay-content-title {
    color: #333333;
  }
  .pay-content-price {
    color: #fe1d1d;
  }
}
.pay-content-title {
  text-align: center;
  font-size: 30px;
  color: #888888;
  letter-spacing: 0;
}
.btn {
  width: 440px;
  height: 88px;
  border-radius: 10px;
  font-size: 36px;
  text-align: center;
  line-height: 89px;
  margin: 0 auto;
}
.go-on-btn {
  background: #7c5cf2;
  color: #ffffff;
  margin-bottom: 30px;
  margin-top: 90px;
}
.look-order-btn {
  background: rgba(124, 92, 242, 0.1);
  color: #7c5cf2;
}
</style>
