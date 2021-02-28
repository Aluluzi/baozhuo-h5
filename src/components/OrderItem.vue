<template>
  <div class="OrderItem">
    <div class="order-top">
      <p class="order-top-box">
        <span class="order-time">订单编号：{{ data.id }}</span>
        <span
          class="order-tips order-tips-wsh"
          :class="status.className"
          >{{ status.statusName }}</span
        >
      </p>
    </div>
    <test-item
      :patient="data.patient"
      :orders="data.orders"
      :tubes="data.tubes"
      :id="data.id"
    ></test-item>
    <div class="order-btn-box">
      <p class="text" v-if="roleType===4">{{ data.samplingTime }}</p>
      <p class="clinicinfo" v-if="roleType===2">{{ data.doctorName }}({{ data.clinicName }})</p>
      <p class="order-total">
        合计：
        <span class="order-unit">￥</span>
        <span class="order-price">{{ data.payAmount/100 }} </span>
      </p>
    </div>
  </div>
</template>

<script>
import TestItem from "./testList/TestItem";
import {mapState} from "vuex";

export default {
  name: "OrderItem",
  components: {
    TestItem,
  },
  props: ["data"],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
    roleType(){
      return this.tokenInfo.roleType
      //roleType
      // 1-后台管理员帐号、
      // 2-业务员帐号
      // 3-诊所管理帐号
      // 4-医生帐号
    },
    status() {
      let obj = {}
      if(this.roleType===2){
        switch (this.data.settleMethod){
          case 1:
            obj.className = 'order-tips-dfk'
            obj.statusName = '日结'
            break;
          case 2:
            obj.className = 'order-tips-bgyc'
            obj.statusName = '月结'
            break;
        }
      }else{
        switch (this.data.status){
          case 0:
            obj.className = 'order-tips-qx'
            obj.statusName = '已关闭'
            break;
          case 10:
            obj.className = 'order-tips-dfk'
            obj.statusName = '待付款'
            break;
          case 20:
            obj.className = 'order-tips-wsh'
            obj.statusName = '未审核'
            break;
          case 30:
            obj.className = 'order-tips-jj'
            obj.statusName = '审核拒绝'
            break;
          case 40:
            obj.className = 'order-tips-bbwc'
            obj.statusName = '报告未出'
            break;
          case 50:
            obj.className = 'order-tips-qx'
            obj.statusName = '订单取消'
            break;
          case 60:
            obj.className = 'order-tips-bbyc'
            obj.statusName = '报告已出'
            break;
        }
      }

      return obj;
    },
  },
  created() {},
  mounted() {},
  destroy() {},
  methods: {
    openPdf(url) {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        //ios
        window.location.href = url;
      } else {
        //android
        this.$router.push({
          path: "/EinvoiceDetail",
          query: {
            invoice_uri: url,
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.OrderItem {
  background: #fff;
  padding: 0 32px 32px;
  .order-top {
    padding: 28px 0 24px;
    height: 88px;
    box-sizing: border-box;
    .order-top-box {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .order-time {
        font-size: 24px;
        color: #333;
        letter-spacing: 0;
      }
      .order-tips {
        font-size: 24px;
        letter-spacing: 0;
        text-align: right;
        border: 1px solid transparent;
        background: #fff;
        padding: 0 24px;
        height: 40px;
        line-height: 42px;
        border-radius: 4px;
      }
      .order-tips-dfk {
        color: #FE9838;
        border-color: #FE9838;
        background-color: rgba(254, 152, 56, 0.1);
      }
      .order-tips-wsh {
        color: #ADB6BA;
        border-color: #ADB6BA;
        background-color: rgba(173, 182, 186, 0.1);
      }
      .order-tips-qx {
        color: #919EAB;
        border-color: #919EAB;
        background-color: rgba(92, 94, 102, 0.1);
      }
      .order-tips-jj {
        color: #ED5353;
        border-color: #ED5353;
        background-color: rgba(237, 83, 83, 0.1);
      }
      .order-tips-bgwc {
        color: #3858E6;
        border-color: #3858E6;
        background-color: rgba(56, 88, 230, 0.1);
      }
      .order-tips-bgyc {
        color: #1DAEC3;
        border-color: #1DAEC3;
        background-color: rgba(29, 174, 195, 0.1);
      }
    }
  }
  .order-btn-box {
    display: flex;
    align-items: flex-end;
    height: 80px;
    position: relative;
    .text {
      font-size: 28px;
      color: #ADB6BA;
      margin-right: auto;
    }
    .clinicinfo{
      font-size: 28px;
      color: #333;
      margin-right: auto;
    }
    .order-total{
      color: #333;
      font-size: 24px;
      .order-unit{
        color: #17AFC3;
        font-size: 24px;
      }
      .order-price{
        color: #17AFC3;
        font-size: 48px;
      }
    }
  }
}
</style>
