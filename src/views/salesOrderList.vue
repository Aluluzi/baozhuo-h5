<template>
  <div class="salesOrderList">
    <van-list :finished="finished" :finished-text="finishedText" v-model="loading">
      <salesOrderItem v-for="(item,index) in list" :data="item" :key="index"></salesOrderItem>
    </van-list>
    <van-empty v-if="list.length <= 0" description="空空如也~"/>
  </div>
</template>

<script>
import salesOrderItem from '@/components/order/salesOrderItem'
import {tradeList} from "@/api";
import {mapState} from "vuex";

export default {
  name: "salesOrderList",
  components: {
    salesOrderItem
  },
  data() {
    return {
      page: 1,
      size: 10,
      // status: "",
      list: [],
      loading: false,
      finished: false,
      finishedText: "",
      nodata: false,

      doctorId:'',
      clinicId:'',
    }
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
  },
  created() {
    const {doctorId,clinicId} = this.$route.query
    this.doctorId = doctorId
    this.clinicId = clinicId
  },
  mounted() {
    this.onLoad(this.doctorId, this.clinicId)
  },
  destroy() {
  },
  activated() {

  },
  methods: {
    onLoad(doctorId,clinicId) {
      let params = {
        page: this.page,
        size: this.size,
        status: "20",
        doctorId: +doctorId,
        clinicId: +clinicId,
        salesmanId: this.tokenInfo.user.salesman.id
      };
      tradeList(params).then(res => {
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
          this.finishedText = ""
          this.loading = false;
          this.finished = true;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.salesOrderList{
  padding: 32px;
}
</style>