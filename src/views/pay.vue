<template>
  <div class="pay">
    <van-cell-group class="group info2">
      <van-cell title="市场价格" :value="'￥'+price"/>
      <van-cell title="补贴金额" :value="'￥'+discountPrice"/>
    </van-cell-group>
    <van-cell-group class="group info1">
      <van-cell title="实际支付" :value="'￥'+payPrice"/>
    </van-cell-group>

    <div class="btn-box">
      <Footbtn text="立即支付" @click_btn="buy" :disabled="false"/>
    </div>
  </div>
</template>

<script>
import Footbtn from "@/components/Footbtn";
import {mapState} from "vuex";
import {Debounce, scaleNum} from "@/utils/utils";
import {addTrade, weChatGetTicked} from "@/api";
import wx from "weixin-js-sdk";

export default {
  name: "pay",
  components: {
    Footbtn
  },
  data() {
    return {

      price: 0,
      discountPrice: 0,
      payPrice: 0
    }
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
  },
  created() {
    // const discount = scaleNum(this.tokenInfo.user.clinic.discount, -2)
    const {orderList} = this.$route.params
    let {discount, id} = this.tokenInfo.user.clinic
    discount = scaleNum(discount, -2)

    let price = 0, payPrice = 0
    for (let k of orderList) {
      price += k.price
      if (k.isPromotion) {//是特殊商品
        const p = this.getPromotionPrice(id, k.Promotions, k.price)
        // price += p
        payPrice += p
      } else {//不是特殊商品
        // price += k.price
        payPrice += this.getDiscountPrice(k.price, discount)
      }
    }

    // this.price = (scaleNum(price, -2)).toFixed(2);//精度计算
    // this.payPrice = (scaleNum(scaleNum(this.price, 2) * discount, -2)).toFixed(2);//精度计算
    // this.discountPrice = scaleNum((scaleNum(this.price, 2) - scaleNum(this.payPrice, 2)), -2)//精度计算

    this.price = (scaleNum(price, -2)).toFixed(2);//精度计算
    this.payPrice = (scaleNum(payPrice,-2)).toFixed(2);//精度计算
    this.discountPrice = (scaleNum((price - payPrice), -2)).toFixed(2);//精度计算

  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    buy: Debounce(function () {
      const {orderList, tubesList, patientInfo} = this.$route.params
      const orders = orderList.map(item => {
        return {
          itemId: item.id
        }
      })
      const tubes = tubesList.map(item => {
        return {
          tubeId: item.id,
          tubeNum: item.num,
          barCode: item.code
        }
      })
      const patient = {
        name: patientInfo.name,
        age: +patientInfo.age,
        sex: patientInfo.sex,
        phone: patientInfo.phone
      }
      const samplingTime = patientInfo.samplingTime
      const params = {
        orders: orders,
        tubes: tubes,
        patient: patient,
        samplingTime: samplingTime,
        labId: orderList[0].labId,
      }

      /*
      * settleMethod
      * 1日结 2月结
      * */
      if (this.tokenInfo.user.clinic.settleMethod === 1) {
        addTrade(params).then(res => {
          if (res.settleMethod == 1) {
            // this.wxPay(res)
            this.authorize(res)
          } else {
            this.$toast('由于您是月结用户，该订单即将生成')
            // this.$router.replace('/order')
            let backNum = history.length - 1;
            history.go(-backNum);
          }
        })
      } else {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '由于您是月结用户，该订单即将生成',
          confirmButtonText: '确认',
          confirmButtonColor: '#21AEC3'
        })
            .then(() => {
              addTrade(params).then(res => {
                if (res.settleMethod == 1) {
                  // this.wxPay(res)
                  this.authorize(res)
                } else {
                  let backNum = history.length - 1;
                  history.go(-backNum);
                }
              })
            })
            .catch(() => {
              this.$toast('您取消了支付')
            });
      }

    }, 300),

    wxPay(res) {
      wx.chooseWXPay({
        appId: res.appId,
        timeStamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
        package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: res.paySign, // 支付签名
        success: function () {
          console.log('支付成功')
          // this.$router.replace('/order')
          let backNum = history.length - 1;
          history.go(-backNum);
        },
        cancel: function (res) {
          this.$toast('您取消了支付')
        }
      });
    },
    authorize(params) {
      const redirect_uri = window.location.href.split('#')[0]
      weChatGetTicked({
        url: redirect_uri
      }).then(res => {
        const {appId, timestamp, noncestr, signature} = res
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
                  // this.$router.replace('/order')
                  let backNum = history.length - 1;
                  history.go(-backNum);
                },
                cancel: function (res) {
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

    getPromotionPrice(id, arr, oldPrice = 0) {//诊所id,遍历的数组,原价
      for (let k of arr) {
        if (id === k.clinicId) {
          return k.price
        }
      }
      return oldPrice
    },
    getDiscountPrice(oldPrice = 0, discount) {
      return oldPrice * discount
    },
  }
}
</script>

<style lang="scss" scoped>
.pay {
  .group {
    margin-top: 16px;
  }

  .btn-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 32px 78px;
  }
}
</style>