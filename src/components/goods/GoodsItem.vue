<template>
  <div class="GoodsItem">
    <div class="item-box van-hairline--bottom">
      <i class="btn btn-check" @click="check" :class="data.isCheck&&'active'"></i>
      <div class="goods-info">
        <p class="goods-name">{{data.name}}</p>
        <p class="goods-price">
          <span>￥</span>
          <span>{{data.price/100}}</span>
        </p>
      </div>
      <i class="btn btn-collection" @click="collection" :class="data.isFavorite&&'active'"></i>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
export default {
  name: "GoodsItem",
  components: {},
  props: ["data","index"],
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    check(){
      this.$emit('_check',this.index)
    },
    collection(){
      this.$emit('_collection',this.index)
    },
  },
};
</script>

<style lang="scss" scoped>
.GoodsItem {
  background: #fff;
  padding:0 24px;

  .item-box {
    display: flex;
    align-items: center;
    //justify-content: space-between;
    padding: 0 24px;

    .btn{
      width: 32px;
      height: 32px;
      background-size: 100% 100%;
    }
    .btn-check{
      background-image: url("../../assets/btn-check.png");
      margin-right:30px;
    }
    .btn-check.active{
      background-image: url("../../assets/btn-check-active.png");
    }
    .btn-collection{
      background-image: url("../../assets/btn-collection.png");
    }
    .btn-collection.active{
      background-image: url("../../assets/btn-collection-active.png");
    }

    .goods-info{
      text-align: left;
      margin-right: auto;
      padding: 24px 0 32px;
      .goods-name{
        color: #333;
        font-size: 32px;
        line-height: 40px;
        font-weight: bold;
      }
      .goods-price{
        color: #21AEC3;
        font-size: 32px;
        line-height: 40px;
        margin-top: 10px;
        >span:first-child{
          font-size: 20px;
        }
      }
    }
  }
}
</style>