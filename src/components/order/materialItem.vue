<template>
  <div class="materialItem">
    <div class="materialItem-info">
      <img v-lazy="pdfURL + list.img" alt="">
      <p class="van-ellipsis">{{ list.name }}</p>
    </div>
    <div class="edit-box">
      <van-stepper v-model="list.num" input-width="60px" button-size="22px"/>
      <input placeholder="请输入条码" v-model="list.code">
    </div>
  </div>
</template>

<script>
import {pdfURL} from "@/config";

export default {
  name: "materialItem",
  components: {},
  props:['list','index'],
  data() {
    return {
      pdfURL:pdfURL
    }
  },
  watch:{
  },
  computed: {},
  created() {
    console.log(this.list)
  },
  mounted() {
  },
  destroy() {
  },
  methods: {}
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