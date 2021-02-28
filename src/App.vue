<template>
  <div id="app">
    <keep-alive :include="keep_alive">
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
// import wx from "weixin-js-sdk";
// import authorize from "@/api/authorize.js";
export default {
  name: "app",
  data() {
    return {
      keep_alive: ["tabbar"],
    };
  },
  watch: {
    $route(to, from) {
      //keep-alive缓存
      if (!from.name && to.meta.keep_alive) {
        let Index = this.keep_alive.findIndex((i) => i === to.name);
        if (Index === -1) {
          this.keep_alive.push(to.name);
        }
      } else if (to.meta.index > from.meta.index && to.meta.keep_alive) {
        let Index = this.keep_alive.findIndex((i) => i === to.name);
        if (Index !== -1) {
          this.keep_alive.splice(Index, 1);
        }
      } else if (to.meta.index < from.meta.index && from.meta.keep_alive) {
        let Index = this.keep_alive.findIndex((i) => i === from.name);
        if (Index !== -1) {
          this.keep_alive.splice(Index, 1);
        }
      } else if (to.meta.index === from.meta.index && to.meta.keep_alive) {
        let Index = this.keep_alive.findIndex((i) => i === from.name);
        if (Index !== -1) {
          this.keep_alive.splice(Index, 1);
        }
        let IndexTo = this.keep_alive.findIndex((i) => i === to.name);
        if (IndexTo === -1) {
          this.keep_alive.push(to.name);
        }
      }

      this.$nextTick(() => {
        if (to.meta.keep_alive) {
          let Index = this.keep_alive.findIndex((i) => i === to.name);
          if (Index === -1) {
            this.keep_alive.push(to.name);
          }
        }
      });
    },
  },
  created: function () {
    // this.getwxapi();
  },
  methods: {
    //获取签名
    getwxapi() {
      // let params = {
      //   official_account: 1,
      //   url: window.location.href.split("#")[0],
      // };
      // authorize.js_api_config(params).then((res) => {
      //   wx.config({
      //     debug: false,
      //     appId: "wx1c8f2c5dc8babec8", // 必填，公众号的唯一标识
      //     timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
      //     nonceStr: res.data.data.noncestr, // 必填，生成签名的随机串
      //     signature: res.data.data.signature, // 必填，签名
      //     jsApiList: ["chooseWXPay", "scanQRCode"], // 必填，需要使用的JS接口列表
      //   });
      //   wx.ready((res) => {
      //     console.log("wx.ready", res);
      //     // wx.scanQRCode({
      //     //   needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      //     //   scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      //     //   success: function(res) {
      //     //     alert(res)
      //     //     console.log(res);
      //     //     // let tracking_num = res.resultStr;
      //     //     // if (tracking_num.includes(",")) {
      //     //     //   tracking_num = tracking_num.split(",")[1];
      //     //     // }
      //     //     // this.barcode = tracking_num
      //     //   }
      //     // });
      //   });
      //   wx.error((err) => {
      //     console.log(err.errMsg);
      //   });
      // });
    },
  },
};
</script>
<style lang="scss">
html,
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F7F8FA;
  color: #333;
  width: 100%;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
</style>
