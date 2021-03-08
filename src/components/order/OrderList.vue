<template>
  <div class="orderList">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div :style="{minHeight:pageHeight+'px'}">
        <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
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
import {mapState} from "vuex";

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
      finished: true,
      finishedText: "",
      nodata: false,

      pageHeight: 0,
      isLoading: false,
    };
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
        // this.finished = true;

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

        this.reset();
        this.onLoad(obj)
      });
    }, 300),
    onLoad(val) {
      let params = {
        page: this.page,
        size: this.size,
        ...val
      };
      if(this.roleType==2){
        params.salesmanId = this.tokenInfo.user.salesman.id
      }
      if(this.roleType==3){
        params.clinicId = this.tokenInfo.user.clinic.id
      }
      if(this.roleType==4){
        params.doctorId = this.tokenInfo.user.doctor.id
      }

      tradeList(params).then((res) => {
        this.$emit('getTotalAmount',res.totalAmount)
        if (res.data.length>0) {
          // 加载状态结束
          this.loading = false;
          this.finished = false;

          this.list = this.list.concat(res.data);
          // let row = Math.ceil(res.total / this.size);
          const row = res.totalPage;
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
          this.finishedText = "";
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
      this.finished = true;
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
