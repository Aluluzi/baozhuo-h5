<template>
  <div class="copy">
    <div
      data-clipboard-action="copy"
      class="cobyOrderSn"
      :data-clipboard-text="text"
      @click="copyLink"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
export default {
  name: "Copy",
  data() {
    return {};
  },
  props: ["text"],
  created() {},
  mounted() {},
  methods: {
    //复制订单编号
    copyLink() {
      let _this = this;
      let clipboard = new Clipboard(".cobyOrderSn");
      clipboard.on("success", function() {
        _this.$toast({ duration: 3000, message: "复制成功" });
      });
      clipboard.on("error", function() {
        _this.$toast({ duration: 3000, message: "复制失败" });
      });
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.copy {
  display: inline-block;
  color: #6059dd;
  font-size: 0.7rem;
}
</style>
