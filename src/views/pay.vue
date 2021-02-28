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
import {Debounce} from "@/utils/utils";
import {addTrade} from "@/api";
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
    const discount = (this.tokenInfo.user.clinic.discount) / 100
    const {orderList} = this.$route.params

    let price = 0
    for (let k of orderList) {
      price += k.price
    }

    this.price = price / 100;
    this.payPrice = this.price * discount;
    this.discountPrice = this.price - this.payPrice

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
          if (res.settleMethod==1) {
            wx.chooseWXPay({
              appId:res.appId,
              timeStamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
              package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: res.paySign, // 支付签名
              success: function () {
                console.log('支付成功')
                this.$router.replace('/order')
              },
              cancel:function(res){
                this.$toast('您取消了支付')
              }
            });
          }else{
            this.$toast('由于您是月结用户，该订单即将生成')
            this.$router.replace('/order')
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
                if (res.settleMethod==1) {
                  wx.chooseWXPay({
                    appId:res.appId,
                    timeStamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
                    package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: res.paySign, // 支付签名
                    success: function () {
                      console.log('支付成功')
                      this.$router.replace('/order')
                    },
                    cancel:function(res){
                      this.$toast('您取消了支付')
                    }
                  });
                }else{
                  this.$router.replace('/order')
                }
              })
            })
            .catch(() => {
              this.$toast('您取消了支付')
            });
      }

    }, 300),
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