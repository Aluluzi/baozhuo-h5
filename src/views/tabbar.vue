<template>
  <div class="tabbar">
    <keep-alive :include="keep_alive">
      <router-view />
    </keep-alive>

    <van-tabbar
      v-model="active"
      active-color="#21AEC3"
      inactive-color="#ADB6BA"
      :route="true"
      :safe-area-inset-bottom="true"
    >
      <van-tabbar-item :to="{name:'getOrder'}" v-if="roleType==4">
        <span>我要下单</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.getOrder.checked : icon.getOrder.check"
        />
      </van-tabbar-item>
      <van-tabbar-item :to="{name:'examine'}" v-if="roleType==2">
        <span>审核</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.examine.checked : icon.examine.check"
        />
      </van-tabbar-item>
      <van-tabbar-item :to="{name:'user'}">
        <span>个人中心</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.user.checked : icon.user.check"
        />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import shop_check from "./../assets/tabbar/shop.png";
import shop_checked from "./../assets/tabbar/shop_checked.png";
import classify_check from "./../assets/tabbar/classify.png";
import classify_checked from "./../assets/tabbar/classify_checked.png";
import main_check from "./../assets/tabbar/main.png";
import main_checked from "./../assets/tabbar/main_checked.png";
import {mapState} from "vuex";

export default {
  name: "tabbar",
  data() {
    return {
      keep_alive: ["getOrder", "examine", "user"],
      active: 2,
      icon: {
        getOrder: {
          check: shop_check,
          checked: shop_checked,
        },
        examine: {
          check: classify_check,
          checked: classify_checked,
        },
        user: {
          check: main_check,
          checked: main_checked,
        },
      },
      // roleType:this.$route.query.roleType
    };
  },
  components: {},
  created() {},
  mounted() {},
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
    roleType(){
      return this.tokenInfo.roleType
      //roleType
      // 1-后台管理员帐号、
      // 2-业务员帐号
      // 3-诊所管理帐号
      // 4-医生帐号
    }
  },
  watch: {
    $route(to, from) {
      switch (to.name) {
        case "getOrder":
          return (this.active = 0);
        case "examine":
          return (this.active = 1);
        case "user":
          return (this.active = 2);
        default:
          return (this.active = 2);
      }
    },
  },
  methods: {},
};
</script>

<style scoped>
.tabbar {
}
</style>