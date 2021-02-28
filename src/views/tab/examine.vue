<template>
  <div class="examine">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div :style="{minHeight:pageHeight+'px'}">
        <van-empty
            class="custom-image"
            description="暂无数据"
            v-if="list.length<=0"
        />
        <examineItem v-for="(item,index) in list" :key="index" :data="item" v-else/>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import examineItem from "_c/examine/examineItem";
import {getSalesmanTrade} from '@/api/index';
import {mapState} from "vuex";
import {Debounce} from "@/utils/utils";

export default {
  name: "examine",
  components: {
    examineItem
  },
  data() {
    return {
      list: [],

      pageHeight: 0,
      isLoading: false,
      status: "",//状态
    }
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
  },
  created() {
    this.getInfo()

    this.pageHeight =
        document.documentElement.clientHeight - 98 ||
        document.body.clientHeight - 98;
  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    //下拉刷新
    onRefresh: Debounce(function () {
      this.$nextTick(() => {
        this.isLoading = false;
        this.getInfo()
      });
    }, 300),
    getInfo() {
      getSalesmanTrade({id: this.tokenInfo.user.salesman.id}).then(res => {
        this.list = [...res]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.examine {
  padding: 32px;
}
</style>