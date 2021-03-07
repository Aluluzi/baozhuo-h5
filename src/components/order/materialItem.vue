<template>
  <div class="materialItem">
    <div class="materialItem-info">
      <img v-lazy="pdfURL + list.img" alt="">
      <p class="van-ellipsis">{{ list.name }}</p>
    </div>
    <div class="edit-box">
      <van-stepper v-model="list.num" input-width="60px" button-size="22px"/>
<!--      <input placeholder="请输入条码" v-model="list.code">-->
<!--      <scan @getBarcode="getBarcode"/>-->
      <div class="scan-box">
        <input placeholder="请输入条码" v-model="barCode">
        <van-icon name="scan" class="scanLogo" @click="scan" />
      </div>
    </div>
  </div>
</template>

<script>
import {pdfURL} from "@/config";
import wx from "weixin-js-sdk";
import {weChatGetTicked} from "@/api";

export default {
  name: "materialItem",
  components: {
  },
  props:['list','index'],
  data() {
    return {
      pdfURL:pdfURL,
      barCode:''
    }
  },
  watch:{
    barCode(val){
      this.list.code = val
    }
  },
  computed: {},
  created() {
    this.barCode = this.list.code
  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    scan(){
      const redirect_uri = window.location.href.split('#')[0]
      const _this = this;
      weChatGetTicked({
        url:redirect_uri
      }).then(res => {
        wx.config({
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: `${res.noncestr}`,
          signature: res.signature,
          jsApiList: ['chooseWXPay','scanQRCode','checkJsApi']
        })
        wx.ready(res => {
          wx.checkJsApi({/*检查微信扫码是否验证通过*/
            jsApiList: ['scanQRCode'],
            success: res => {
              wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  setTimeout(function(){
                    let result = res.resultStr;// 当needResult 为 1 时，扫码返回的结果
                    if (result.includes(",")) {
                      result = result.split(",")[1];
                    }
                    _this.barCode = result

                  },1000)

                }
              })
            },
            fail: err => {
              console.log('check scanQRCode fail:', err)
            }
          })
        })

      })

    }
  }
}
</script>

<style lang="scss" scoped>
.materialItem {
  display: flex;
  align-items: center;
  height: 180px;
  background: #fff;
  padding-left: 38px;
  margin-bottom: 32px;

  .materialItem-info {
    margin-right: 46px;
    text-align: center;

    > img {
      width: 88px;
      height: 88px;
    }

    > p {
      width: 88px;
      color: #333;
      font-size: 24px;
      text-align: center;
      margin-top: 10px;
    }
  }

  .edit-box {
    position: relative;
    .scan-box{
      position: relative;
      >input{
        display: inline-block;
        height: 68px;
        line-height: 68px;
        font-size: 28px;
        color: #333;
        border: none;
        width: 474px;
        border-bottom: 1px solid #E5E5E5;
        margin-top: 20px;
      }
      .scanLogo {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 48px;
      }
    }

  }

  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #ADB6BA;
  }

  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #ADB6BA;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #ADB6BA;
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #ADB6BA;
  }
}
</style>