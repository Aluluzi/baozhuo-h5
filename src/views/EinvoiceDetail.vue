<template>
  <div class="einvoiceDetail">

    <div v-if="isShowPdf" id="pdf-box"></div>

    <div v-else>
      <div class="content" >
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

  </div>
</template>
<script>
import Clipboard from "clipboard"; //复制
import FootBtn from "@/components/Footbtn.vue";
import Pdfh5 from "pdfh5";

export default {
  name: "EinvoiceDetail",
  components: {
    FootBtn,
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
      invoice_uri: "",

      Pdfh5:null,
      isShowPdf:true,
    };
  },
  created() {
    this.invoice_uri = this.$route.query.invoice_uri;
  },
  mounted() {

    //实例化
    this.pdfh5 = new Pdfh5("#pdf-box", {
      pdfurl: this.invoice_uri
    });
    //监听完成事件
    this.pdfh5.on("complete", function (status, msg, time) {
      console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum)
      if(status!=='success'){
        this.isShowPdf = false
      }
    })
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
@import "~pdfh5/css/pdfh5.css";

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


  #pdf-box{
    width: 100%;
    height: 100%;
  }
}
</style>

