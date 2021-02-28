<template>
  <div class="user">
    <div class="userInfo">
      <div class="userInfo-headImg"><img v-lazy="tokenInfo.user.img" alt=""></div>
      <div class="userInfo-box">
        <p class="userInfo-name">{{ tokenInfo.user.name }}</p>
        <p class="userInfo-phone">{{ tokenInfo.user.phone }}</p>
      </div>
    </div>
    <div class="box-shadow"></div>


    <div class="work-info" v-if="roleType==4">
      <p class="van-hairline--bottom">
        <span class="title">我的业务员</span>
        <span
            class="value">{{ (tokenInfo.user.salesman && tokenInfo.user.salesman.name) || '-' }}/{{ (tokenInfo.user.salesman && tokenInfo.user.salesman.phone) || '-' }}</span>
      </p>
      <p>
        <span class="title">所属诊所</span>
        <span class="value">{{ tokenInfo.user.clinic.name }}</span>
      </p>
    </div>

    <div class="item-list">
      <van-cell title="我的客户" icon="contact" is-link @click="link('/clinicList')" v-if="roleType==2"></van-cell>
      <van-cell title="我的订单" icon="orders-o" is-link @click="link('/order')"></van-cell>
    </div>

    <p class="logout" @click="logout">退出登录</p>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "user",
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
    roleType() {
      return this.tokenInfo.roleType
      //roleType
      // 1-后台管理员帐号、
      // 2-业务员帐号
      // 3-诊所管理帐号
      // 4-医生帐号
    }
  },
  created() {
  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    link(type) {
      this.$router.push(type)
    },
    logout() {
      this.$store.dispatch("saveToken", {});
      localStorage.removeItem("loginInfo");

      this.$router.replace("/login");

    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding: 38px 32px;

  .userInfo {
    height: 209px;
    background: linear-gradient(180deg, rgba(33, 174, 195, 0.68) 0%, #21AEC3 100%);
    border-radius: 12px;

    display: flex;
    align-items: center;
    padding-left: 48px;

    .userInfo-headImg {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 3px solid #fff;
      margin-right: 27px;
      background: #fff;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .userInfo-box {
      color: #fff;

      .userInfo-name {
        font-size: 40px;
      }

      .userInfo-phone {
        font-size: 24px;
        margin-top: 12px;
      }
    }

  }

  .box-shadow {
    position: relative;
    top: -24px;
    width: 100%;
    height: 24px;
    background: #21AEC3;
    border-radius: 8px;
    opacity: 0.8;
    filter: blur(20px);
  }

  .work-info {
    margin-top: 38px;
    background: #fff;
    padding: 0 32px;

    > p {
      display: flex;
      align-items: center;
      height: 104px;
      justify-content: space-between;

      > .title {
        color: #ADB6BA;
        font-size: 24px;
      }

      > .value {
        color: #333;
        font-size: 32px;
        font-weight: bold;
      }
    }
  }

  .item-list {
    margin-top: 24px;

    .order-logo {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-right: 16px;
      background: url("../../assets/order.png");
      background-size: 100% 100%;

      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .logout {
    text-align: center;
    text-decoration: underline;
    color: #21AEC3;
    font-size: 28px;
    position: fixed;
    bottom: 160px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>