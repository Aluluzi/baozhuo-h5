<template>
  <div class="orderList">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div :style="{minHeight:pageHeight+'px'}">
        <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
        >
          <div>
            <order-item
                :data="x"
                v-for="(x, index) in list"
                :key="index"
                class="orderItem"
            ></order-item>
          </div>
        </van-list>
        <van-empty v-if="list.length <= 0" description="空空如也~" />
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import OrderItem from "@/components/OrderItem";
import {tradeList} from "@/api/index";
import {Debounce, getFormatDate} from "@/utils/utils.js";

export default {
  name: "OrderList",
  components: {
    OrderItem,
  },
  props: ["params"],
  data() {
    return {
      page: 1,
      size: 10,
      list: [],
      loading: false,
      finished: false,
      finishedText: "",
      nodata: false,

      pageHeight: 0,
      isLoading: false,
    };
  },
  computed: {},
  created() {
    this.pageHeight =
        document.documentElement.clientHeight - 98 ||
        document.body.clientHeight - 98;
  },
  mounted() {
    this.onLoad({
      status:""
    });
  },
  watch:{
    params(val){
      const obj = val
      if(obj.createdFrom) {
        obj.createdFrom = getFormatDate(obj.createdFrom,'ymdhms','-')
      }else{
        delete obj.createdFrom
      }
      if(obj.createdEnd) {
        obj.createdEnd = getFormatDate(obj.createdEnd,'ymdhms','-')
      }else{
        delete obj.createdEnd;
      }
      if(!obj.settleMethod) delete obj.settleMethod;

      this.reset();
      this.onLoad(obj)
    },
  },
  destroy() {},
  methods: {
    //下拉刷新
    onRefresh: Debounce(function () {
      this.$nextTick(() => {
        this.isLoading = false;

        const obj = this.params
        if(obj.createdFrom) {
          obj.createdFrom = getFormatDate(obj.createdFrom,'ymdhms','-')
        }else{
          delete obj.createdFrom
        }
        if(obj.createdEnd) {
          obj.createdEnd = getFormatDate(obj.createdEnd,'ymdhms','-')
        }else{
          delete obj.createdEnd;
        }
        if(!obj.settleMethod) delete obj.settleMethod;

        this.onLoad(obj)
      });
    }, 300),
    onLoad(val) {
      let params = {
        page: this.page,
        size: this.size,
        ...val
      };

      tradeList(params).then((res) => {
        this.$emit('getTotalAmount',res.totalAmount)
        if (res.data.length>0) {
          // 加载状态结束
          this.loading = false;
          this.list = this.list.concat(res.data);
          let row = Math.ceil(res.total / this.size);
          this.list.length === 0
            ? (this.finishedText = "")
            : (this.finishedText = "没有更多了");
          if (this.page >= row) {
            // 数据全部加载完成
            this.finished = true;
            if (this.list.length === 0) {
              this.nodata = true;
            }
          }
          this.page++;
        } else {
          this.loading = false;
          this.finished = true;
        }
      });
    },
    reset(){
      this.list = [];
      this.page = 1;
      this.size = 10;
      this.loading = false;
      this.finished = false;
      this.finishedText = '';
      this.nodata = false;
    },
  },
};
</script>
<style scoped lang="scss">
.orderList {
  padding: 24px 32px;
  .orderItem {
    margin-bottom: 20px;
  }
}
</style>
