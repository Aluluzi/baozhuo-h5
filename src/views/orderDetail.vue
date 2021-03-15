<template>
  <div class="orderDetail" :class="status_id===10?'dfk':''">
    <div class="order-top-bg"></div>

    <div class="order-content">
      <!--订单信息-->
      <div class="order-info">
        <p class="order-info-status" :class="status_id | orderStatus_className">{{ status_id | orderStatus_name }} <span class="checkReports_title" v-if="reports.length>0" @click="openReportsBox">查看报告</span>  </p>
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
<!--      <div class="order-item-other-box" v-if="reports.length>0">-->
<!--        <p class="order-item-other-title">检测报告</p>-->
<!--        <van-cell @click="checkReport(item)" v-for="(item,index) in reports" :key="index" class="van-hairline&#45;&#45;bottom"-->
<!--                  :title="'报告'+ (+index+1)" is-link/>-->
<!--      </div>-->

      <FootBtnTwo v-if="status_id===10" left_text="取消订单" right_text="前往支付" @click_left_btn="_cancel"
                  @click_right_btn="_pay"/>


      <van-popup v-model="isShowReports" closeable round>
          <div class="reports-box" >
            <p class="reports-box-title">检测报告</p>

            <div class="reports-item-box">
              <div class="reports-items"   v-for="(item,index) in reports" :key="index">
                <div class="reports-item check" @click="checkReport(item)">
<!--                  <i class="reports-logo"></i>-->
                  <van-icon name="description" />
                  <span class="reports-name">查看报告{{ +index+1 }}</span>
                </div>
                <div class="reports-item load" @click="loadReport(item)" v-if="isAndroid">
<!--                  <i class="reports-logo"></i>-->
                  <van-icon name="down" />
                  <span class="reports-name">下载报告{{ +index+1 }}</span>
                </div>
              </div>
            </div>
          </div>
      </van-popup>
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
      orderListRequestUrl:baseURL+'/api/trade/',
      // orderListRequestUrl:'http://localhost:8080/apis/api/trade/',
      //
      isShowReports: false,

      isAndroid:false,
    }
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

    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      //ios
      this.isAndroid = false
    } else {
      //android
      this.isAndroid = true
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
          .post(this.orderListRequestUrl + this.id, {header: 'token'})
          .then(function (res) {
            if (res.data.code === 200) {
              const datas = res.data.data
              _this.status_id = datas.status
              // _this.status = _this.formatStatus(datas.status)
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
    // formatStatus(status) {
    //   let obj = {}
    //   switch (status) {
    //     case 0:
    //       obj.className = 'order-info-status-qx'
    //       obj.statusName = '已关闭'
    //       break;
    //     case 10:
    //       obj.className = 'order-info-status-dfk'
    //       obj.statusName = '待付款'
    //       break;
    //     case 20:
    //       obj.className = 'order-info-status-wsh'
    //       obj.statusName = '未审核'
    //       break;
    //     case 30:
    //       obj.className = 'order-info-status-jj'
    //       obj.statusName = '审核拒绝'
    //       break;
    //     case 40:
    //       obj.className = 'order-info-status-bbwc'
    //       obj.statusName = '报告未出'
    //       break;
    //     case 50:
    //       obj.className = 'order-info-status-qx'
    //       obj.statusName = '订单取消'
    //       break;
    //     case 60:
    //       obj.className = 'order-info-status-bgyc'
    //       obj.statusName = '报告已出'
    //       break;
    //       default:
    //         obj.className = 'order-info-status-qx'
    //         obj.statusName = ' - '
    //         break;
    //   }
    //   return obj;
    // },
    _cancel() {
      tradeCancel({
        id: this.id
      }).then(res => {
        this.$toast('您已取消该笔订单')
      })
    },
    authorize(params){
      const redirect_uri = window.location.href.split('#')[0]
      weChatGetTicked({
        url:redirect_uri
      }).then(res=>{
        const {appId,timestamp,noncestr,signature} = res
        wx.config({
          debug: false,
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
              // alert(JSON.stringify(params))
              /*微信支付*/
              wx.chooseWXPay({
                appId: params.appId,
                timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
                package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: params.paySign, // 支付签名
                success: function () {
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
      getPayParam({
        id: this.id
      }).then(res=>{
        if(res){
          this.authorize(res)
          // wx.chooseWXPay({
          //   appId:res.appId,
          //   timestamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          //   nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
          //   package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          //   signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          //   paySign: res.paySign, // 支付签名
          //   success: function () {
          //     let backNum=history.length-1;
          //     history.go(-backNum);
          //   },
          //   cancel:function(res){
          //     this.$toast('您取消了支付')
          //   }
          // });

        }
      })
    },

    openReportsBox(){
      this.isShowReports = true;

    },
    checkReport(url) {
      // window.location.href = pdfURL + url;

      if(this.isAndroid){
        //Android
        this.$router.push({
          path: "/EinvoiceDetail",
          query: {
            invoice_uri: url,
          },
        });
      }else{
        //ios
        window.location.href = pdfURL + url
      }
      // if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      //   //ios
      //   window.location.href = pdfURL + url;
      // } else {
      //   //android
      //   this.$router.push({
      //     path: "/EinvoiceDetail",
      //     query: {
      //       invoice_uri: '/preview/'+url,
      //     },
      //   });
      // }

    },
    loadReport(url){
      window.location.href = pdfURL + url
        // this.$router.push({
        //   path: "/EinvoiceDetail",
        //   query: {
        //     invoice_uri: url,
        //   },
        // });
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
      .checkReports_title{
        color: #21AEC3;
        font-size: 24px;
        margin-left: 16px;
        text-decoration: underline;
      }
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

  .reports-box{
    width: 560px;
    padding: 48px 32px;
    .reports-box-title{
      text-align: center;
      color: #333;
      font-size: 32px;
      line-height: 40px;
      font-weight: bold;
      margin-bottom: 32px;
    }
    .reports-item-box{
      max-height: 476px;
      overflow:auto;
      .reports-items{
        display: flex;
        align-items: center;
        .check{
          background: rgba(33, 174, 195, .05);
          .reports-name{
            color: #21AEC3;
          }
          i{
            color: #21AEC3;
          }
        }
        .load{
          margin-left: 15px;
          background: rgba(254, 152, 56, 0.1);
          .reports-name{
            color: #FE9838;
          }
          i{
            color: #FE9838;
          }
        }
      }
    }
    .reports-item{
      height: 84px;
      //background: rgba(33, 174, 195, .05);
      border-radius: 1px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      margin-bottom: 24px;
      flex: 1;

      .reports-logo{
        display: inline-block;
        width: 32px;
        height: 32px;
        margin-right: 16px;
        background-image: url("../assets/reports-logo.png");
        background-size: 100% 100%;
      }
      .reports-name{
        font-size: 28px;
        margin-left: 10px;
      }
      i{
        font-size: 28px;
      }
    }
  }

}


</style>
