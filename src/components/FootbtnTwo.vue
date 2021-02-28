<template>
  <div class="footbtnTwo">
    <div class="btn-box">
      <div class="left-btn ">
        <van-button class="default btn" @click="click_left_btn">{{left_text}}</van-button>
      </div>
      <div class="right-btn btn">
        <van-button class="primary btn" :disabled="disabled" @click="click_right_btn">{{right_text}}</van-button>
        <div class="box-shaow"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FootbtnTwo",
  data() {
    return {};
  },
  props: ["left_text", "right_text", "disabled"],
  created() {},
  mounted() {},
  methods: {
    click_left_btn() {
      this.$emit("click_left_btn");
    },
    click_right_btn() {
      this.$emit("click_right_btn");
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
.footbtnTwo {
  z-index: 999;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 108px;
  padding: 32px 32px 85px;
  background-color: #F7F8FA;
  .btn-box {
    display: flex;
    display: -webkit-box;
    align-items: center;
    .btn{
      border-radius: 8px;
    }
    .left-btn {
      flex: 1;
      margin-right: 32px;
      .default {
        width: 100%;
        height: 88px;
        font-size: 28px;
        color: #333;
        border: 0;
        background-color: #fff;
      }
    }
    .right-btn {
      flex: 1;
      position: relative;
      .primary {
        width: 100%;
        background: #21AEC3;
        height: 88px;
        font-size: 28px;
        color: #ffffff;
        border: 0;
        position: relative;
        z-index: 5;
      }
      .box-shaow{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 24px;
        background: #21AEC3;
        border-radius: 8px;
        opacity: 0.8;
        filter: blur(20px);
      }
    }
  }
}
@media only screen and (device-width: 750px) and (device-height: 1624px) and (-webkit-device-pixel-ratio: 3) {
  .footbtnTwo {
    background-color: #f5f5f5;
    height: 148px;
    padding-bottom: 40px;
    .btn-box {
      .left-btn {
        padding: 30px;
        .default {
          width: 100%;
          height: 88px;
          font-size: 36px;
          color: #333;
          border: 0;
          border-radius: 10px;
        }
      }
      .right-btn {
        padding: 30px;
        .primary {
          width: 100%;
          background: #7d5cf3;
          height: 88px;
          font-size: 36px;
          color: #ffffff;
          border: 0;
          border-radius: 10px;
        }
      }
    }
  }
}
@media only screen and (device-width: 828px) and (device-height: 1792px) and (-webkit-device-pixel-ratio: 2) {
  .footbtnTwo {
    background-color: #f5f5f5;
    height: 148px;
    padding-bottom: 40px;
    .btn-box {
      .left-btn {
        padding: 30px;
        .default {
          width: 100%;
          height: 88px;
          font-size: 36px;
          color: #333;
          border: 0;
          border-radius: 10px;
        }
      }
      .right-btn {
        padding: 15px;
        .primary {
          width: 100%;
          background: #7d5cf3;
          height: 2.2rem;
          font-size: 0.9rem;
          color: #ffffff;
          border: 0;
          border-radius: 5px;
        }
      }
    }
  }
}
//iphone Xs Max
@media only screen and (device-width: 828px) and (device-height: 1792px) and (-webkit-device-pixel-ratio: 3) {
  .footbtnTwo {
    background-color: #f5f5f5;
    height: 3.7rem;
    padding-bottom: 20px;
    .btn-box {
      .left-btn {
        padding: 15px;
        .default {
          width: 100%;
          height: 2.2rem;
          font-size: 0.9rem;
          color: #333;
          border: 0;
          border-radius: 5px;
        }
      }
      .right-btn {
        padding: 15px;
        .primary {
          width: 100%;
          background: #7d5cf3;
          height: 2.2rem;
          font-size: 0.9rem;
          color: #ffffff;
          border: 0;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
