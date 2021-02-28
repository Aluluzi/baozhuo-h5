<template>
  <div class="einvoiceDetail">

    <!--        <div v-if="ios_suo">-->
    <!--            <object :data="invoice_uri" width="100%" height="100%"></object>-->
    <!--            <iframe :src="invoice_uri" frameborder="0" style="width: 100%; height: 100%"  scrolling="yes"></iframe>-->
    <!--&lt;!&ndash;            <embed :src="invoice_uri" frameborder="0" style="width: 100%; height: 100%" scrolling="yes"></embed>&ndash;&gt;-->
    <!--&lt;!&ndash;            <pdf :src="invoice_uri"></pdf>&ndash;&gt;-->
    <!--        </div>-->
    <div class="content" v-if="!ios_suo">
      <span>{{ invoice_uri }}</span>
      <p>暂不支持安卓手机在线阅读pdf,请复制链接到本地浏览器打开</p>
    </div>
    <div class="btn-box">
      <FootBtn text="复制链接"
               :disabled="false"
               data-clipboard-action="copy"
               class="cobyOrderSn"
               :data-clipboard-text="invoice_uri"
               @click_btn="copyLink"/>
    </div>
  </div>
</template>
<script>
// import Copy from "@/components/Copy.vue";
import Clipboard from "clipboard";
import FootBtn from "@/components/Footbtn.vue";

import pdf from 'vue-pdf'

export default {
  name: "EinvoiceDetail",
  components: {
    // Copy,
    FootBtn,
    pdf
  },
  metaInfo: {
    meta: [
      {
        name: 'viewport',
        content: 'user-scalable=yes, width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=2,viewport-fit=cover'
      }
    ]
  },
  data() {
    return {
      deviceHeight: "",
      invoice_uri: "",
      // pdfSrc:'',
      ios_suo: false,
      // numPages:null,
    };
  },
  created() {
    this.invoice_uri = this.$route.query.invoice_uri;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      //ios
      this.ios_suo = true;

      // window.location.replace(this.invoice_uri)
      window.location.href = this.invoice_uri
    } else {
      //android
      this.ios_suo = false
    }
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    copyLink() {
      let _this = this;
      let clipboard = new Clipboard(".cobyOrderSn");
      clipboard.on('success', function () {
        _this.$toast("复制成功")
      });
      clipboard.on('error', function () {
        _this.$toast("复制失败")
      });
    }
  }
};
</script>
<style scoped lang="scss">
.einvoiceDetail {
  overflow-y: auto;
  position: relative;
  background: #fff;
  height: 100vh;

  .content {
    background-color: #fff;
    padding: 30px;
    font-size: 32px;

    > span {
      word-wrap: break-word;
      -webkit-user-select: all;
      -moz-user-select: all;
      user-select: all;
      -ms-user-select: all;
      font-size: 28px;
      color: #645ce2;
    }

    > p {
      font-size: 28px;
      margin-top: 20px;
    }

    .copy-text {
      margin: 0 5px;
      display: inline-block;
      padding: 1px 6px;
      background: #f5f5f5;
      border: 1px solid #b6b6b6;
      border-radius: 10px;
      font-size: 30px;
      color: #666666;
    }
  }

  .btn-box {
    padding: 32px;
  }
}
</style>

