<template>
  <div class="orderDetail" :class="status_id===10?'dfk':''">
    <div class="order-top-bg"></div>

    <div class="order-content">
      <!--订单信息-->
      <div class="order-info">
        <p class="order-info-status" :class="status.className">{{ status.statusName }}</p>
        <p class="order-info-sn">
          <span>订单编号：{{ orderId }}</span>
          <span>{{ labName }}</span>
        </p>
        <orderDetailItem v-for="(item,index) in orderList" :key="index" :data="item" :name="item.name" :payment="item.payment" :price="item.price" class="order-item"/>
        <orderDetailMaterial :list="materialList"/>

        <div class="order-pay-price">
          <p class="order-item-num">
            共{{ orderList.length }}个检测项目
          </p>
          <p class="item-pay-price">
            实际支付:
            <span class="item-pay-price-unit">￥</span>
            <span class="item-pay-price-num">{{ payPrice / 100 }}</span>
          </p>
        </div>
      </div>

      <div class="order-item-other-box">
        <p class="order-item-other-title">检验医生</p>
        <div class="order-item-other-content doc-info">
          <span class="doc-clinic van-ellipsis">{{ clinic_name }}</span>
          <span class="doc-name van-ellipsis">{{ doc_name }}</span>
        </div>
      </div>

      <div class="order-item-other-box">
        <p class="order-item-other-title">患者信息</p>
        <div class="order-item-other-content">
          <infoCell v-for="(item,index) in infoList" :key="index" class="van-hairline--bottom" :title="item.title"
                    :value="item.value"/>
        </div>
      </div>

      <div class="order-item-other-box">
        <p class="order-item-other-title">时间信息</p>
        <div class="order-item-other-content">
          <infoCell v-for="(item,index) in timeList" :key="index" class="van-hairline--bottom" :title="item.title"
                    :value="item.value"/>
        </div>
      </div>
      <!--      reports-->
      <div class="order-item-other-box" v-if="reports.length>0">
        <p class="order-item-other-title">检测报告</p>
        <van-cell @click="checkReport(item)" v-for="(item,index) in reports" :key="index" class="van-hairline--bottom"
                  :title="'报告'+ (+index+1)" is-link/>
      </div>

      <FootBtnTwo v-if="status_id===10" left_text="取消订单" right_text="前往支付" @click_left_btn="_cancel"
                  @click_right_btn="_pay"/>
    </div>
  </div>
</template>
<script>
import orderDetailItem from '@/components/order/orderDetailItem'
import orderDetailMaterial from '@/components/order/orderDetailMaterial'
import infoCell from '@/components/InfoCell'

import FootBtnTwo from "@/components/FootbtnTwo";

import Vue from "vue";
import axios from "axios";

Vue.prototype.$http = axios;

import {baseURL, pdfURL} from "@/config";
import {mapState} from "vuex";
import store from "@/store";

import {tradeCancel, getPayParam, weChatGetTicked} from '@/api/index'
import wx from "weixin-js-sdk";

export default {
  name: "orderDetail",
  components: {
    orderDetailItem,
    orderDetailMaterial,
    infoCell,
    FootBtnTwo,
  },
  data() {
    return {
      id: null,

      orderList: [],
      materialList: [],
      infoList: [],
      timeList: [],

      status: {},
      status_id: null,
      orderId: '',
      labName: '',
      payPrice: 0,
      reports: [],
      clinic_name: '',
      doc_name: '',
    };
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),

  },
  watch: {},
  created() {
    let {
      token
    } = store.state.tokenInfo;
    axios.defaults.headers.Authorization = token

    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getData();
    } else {
      this.$toast("数据加载错误，请稍后重试");
    }

  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    //订单详情
    getData() {
      const _this = this;
      this.$http
          .post(baseURL + '/api/trade/' + this.id, {header: 'token'})
          .then(function (res) {
            if (res.data.code === 200) {
              const datas = res.data.data
              _this.status_id = datas.status
              _this.status = _this.formatStatus(datas.status)
              _this.orderId = datas.id
              _this.labName = datas.labName
              _this.payPrice = datas.payAmount

              _this.orderList = datas.orders
              _this.materialList = datas.tubes
              _this.reports = datas.reports

              _this.clinic_name = datas.clinicName
              _this.doc_name = datas.doctorName

              _this.infoList = [
                {title: '姓名', value: datas.patient.name},
                {title: '年龄', value: datas.patient.age},
                {title: '性别', value: datas.patient.sex === 'F' ? '女' : '男'},
                {title: '手机号码', value: datas.patient.phone}
              ]
              _this.timeList = [
                {title: '下单时间', value: datas.created},
                {title: '采样时间', value: datas.samplingTime},
              ]
            }
          })
          .catch(function (res) {
            _this.$toast(res.data.message);
          });
    },
    formatStatus(status) {
      let obj = {}
      switch (status) {
        case 0:
          obj.className = 'order-info-status-qx'
          obj.statusName = '已关闭'
          break;
        case 10:
          obj.className = 'order-info-status-dfk'
          obj.statusName = '待付款'
          break;
        case 20:
          obj.className = 'order-info-status-wsh'
          obj.statusName = '未审核'
          break;
        case 30:
          obj.className = 'order-info-status-jj'
          obj.statusName = '审核拒绝'
          break;
        case 40:
          obj.className = 'order-info-status-bbwc'
          obj.statusName = '报告未出'
          break;
        case 50:
          obj.className = 'order-info-status-qx'
          obj.statusName = '订单取消'
          break;
        case 60:
          obj.className = 'order-info-status-bbyc'
          obj.statusName = '报告已出'
          break;
      }
      return obj;
    },
    _cancel() {
      tradeCancel({
        id: this.id
      }).then(res => {
        console.log(res)
      })
    },
    authorize(_package,signType, paySign){
      const redirect_uri = window.location.href.split('#')[0]
      weChatGetTicked({
        url:redirect_uri
      }).then(res=>{
        const {appId,timestamp,noncestr,signature} = res
        wx.config({
          debug: true,
          appId: appId,
          timestamp: timestamp,
          nonceStr: `${noncestr}`,
          signature: signature,
          jsApiList: ['chooseWXPay']
        })
        wx.ready(res => {
          wx.checkJsApi({/*检查微信支付是否验证通过*/
            jsApiList: ['chooseWXPay'],
            success: res => {
              console.log('checked api:', res)
              /*微信支付*/
              wx.chooseWXPay({
                appId:appId,
                timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: noncestr, // 支付签名随机串，不长于 32 位
                package: _package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: paySign, // 支付签名
                success: function () {
                  // this.$router.replace('/order')
                  let backNum=history.length-1;
                  history.go(-backNum);
                },
                cancel:function(res){
                  this.$toast('您取消了支付')
                }
              });
            },
            fail: err => {
              console.log('check api fail:', err)
            }
          })
        })
      })
    },
    _pay() {
      console.log(4)
      getPayParam({
        id: this.id
      }).then(res=>{
        if(res){

this.authorize(res.package,res.signType,res.paySign)

        }
      })
    },

    checkReport(url) {
      const link = pdfURL + url
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        //ios
        window.location.href = link;
      } else {
        //android
        this.$router.push({
          path: "/EinvoiceDetail",
          query: {
            invoice_uri: link,
          },
        });
      }

    }
  },
};
</script>

<style lang="scss" scoped>
.orderDetail {
  position: relative;

  .send-box {
    position: absolute;
    bottom: 108px;
    left: 0;
    width: 100%;
  }
}

.orderDetail.dfk {
  padding-bottom: 88px;
}

.order-top-bg {
  width: 100%;
  height: 262px;
  background: linear-gradient(180deg, rgba(33, 174, 195, 0.68) 0%, #21AEC3 100%);
  box-sizing: border-box;
}

.order-content {
  padding: 32px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  top: -160px;

  .order-info {
    padding: 32px;
    background: #fff;
    border-radius: 20px;
    margin-top: 20px;
    overflow: hidden;

    .order-info-status {
      color: #FE9838;
      font-size: 40px;
      margin-bottom: 24px;
    }

    .order-info-status-dfk {
      color: #FE9838;
    }

    .order-info-status-wsh {
      color: #ADB6BA;
    }

    .order-info-status-qx {
      color: #919EAB;
    }

    .order-info-status-jj {
      color: #ED5353;
    }

    .order-info-status-bgwc {
      color: #3858E6;
    }

    .order-info-status-bgyc {
      color: #1DAEC3;
    }

    .order-info-sn {
      color: #333;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .order-item {
      margin-bottom: 16px;
    }

    .order-info-box {
      padding-left: 30px;
    }

    .order-pay-price {
      text-align: right;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      margin-top: 40px;

      .order-item-num {
        color: #9D9D9D;
        font-size: 28px;
        margin-right: 32px;
      }

      .item-pay-price {
        color: #333;
        font-size: 24px;
        margin-right: 32px;

        .item-pay-price-unit {
          color: #17AFC3;
          font-size: 24px;
        }

        .item-pay-price-num {
          color: #17AFC3;
          font-size: 48px;
        }
      }
    }

    .van-hairline--top-bottom:after,
    .van-hairline-unset--top-bottom:after {
      display: none;
    }
  }

  .order-item-other-box {
    padding-top: 32px;

    .order-item-other-title {
      color: #333;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 24px;
    }

    .order-item-other-content {
      background: #fff;
      padding: 0 32px;
    }

    .doc-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100px;
      .doc-clinic{
        color: #9D9D9D;
        font-size: 28px;
        flex: 1;
        text-align: left;
      }
      .doc-name{
        color: #333;
        font-size: 28px;
        flex: 1;
        text-align: right;
      }
    }
  }

}


</style>
