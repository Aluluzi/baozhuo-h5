<template>
  <div class="scan">
<!--    <van-field :placeholder="placeholder" v-model="barcode" />-->
    <input placeholder="请输入条码" v-model="barcode">
    <van-icon name="scan" class="scanLogo" @click="scan" />
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  name: "scan",
  data() {
    return {
      barcode: ""
    };
  },
  props:['label','placeholder'],
  components: {},
  created() {},
  mounted() {},
  computed: {},
  watch: {
    barcode: function(val) {
      this.$emit("getBarcode", val);
    }
  },
  methods: {
    //扫码
    scan() {
      let _this = this;
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["barCode","qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {

          setTimeout(function(){
            console.log('resultStr,'+res.resultStr)
            alert(res)
          },1)
          let tracking_num = res.resultStr;
          if (tracking_num.includes(",")) {
            tracking_num = tracking_num.split(",")[1];
          }
          alert(tracking_num)
          console.log(tracking_num)
          // _this.barcode = tracking_num;
        }
      });
      // wx.scanQRCode({
      //   needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      //   scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      //   success: function (res) {
      //     alert(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
      //   }
      // })
    }
  }
};
</script>

<style lang="scss" scoped>
.scan {
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
</style>