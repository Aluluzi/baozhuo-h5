<template>
  <div class="order">

    <div class="order-search-box">
      <div class="order-search-time-box">
        <div class="order-search-time">
          <i></i>
          <input class="order-search-title active" placeholder="请选择开始时间" v-model="start_time"
                 @click="chooseTime('start_time')" readonly>
          <span class="order-search-txt">至</span>
          <input class="order-search-title active" placeholder="请选择结束时间" v-model="end_time"
                 @click="chooseTime('end_time')" readonly>

        </div>
        <div class="order-search-time-btn" @click="time_reset">重置</div>
      </div>
      <div class="order-search-type-box">
        <div v-for="(item,index) in tab_list" :key="index" :class="status===item.status?'active':''"
             @click="chooseType(item.status)">{{ item.title }}
        </div>
      </div>
      <div class="order-search-type-box" v-if="roleType==2">
        <div v-for="(item,index) in settleMethod_list" :key="index" :class="settleMethodType===item.value?'active':''"
             @click="chooseSettleMethod(item.value)">{{ item.title }}
        </div>
      </div>
    </div>
    <OrderList :params="params" @getTotalAmount="_getTotalAmount"/>
    <div class="order-total-box" v-show="isShowTotalPrice">
      <p class="order-total">
        该时间订单合计金额：
        <span class="order-unit">￥</span>
        <span class="order-price">{{ totalAmount / 100 }}</span>
      </p>
    </div>

    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
          @confirm="timeIsConfirm"
          v-model="currentDate"
          type="date"
          @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>
<script>
import OrderList from "@/components/order/OrderList";

import {Debounce, getFormatDate} from "@/utils/utils.js";

import {mapState} from "vuex";

export default {
  name: "order",
  components: {
    OrderList,
  },
  data() {
    return {

      status: "",//状态
      settleMethodType: "",//日结月结
      isReset: false,

      settleMethod_list: [{title: '日结', value: '1'}, {title: '月结', value: '2'}],
      showPicker: false,
      currentDate: new Date(),
      start_time: '',
      end_time: '',
      type: '',
      params: {},//查询参数
      totalAmount:0
    };
  },
  watch: {
    status(val) {
      this.params = {
        status: val,
        createdFrom: this.start_time,
        createdEnd: this.end_time,
        settleMethod: this.settleMethodType
      }
    },
    start_time(val) {
      if (val && this.end_time) {
        if (new Date(val) < new Date(this.end_time)) {
          this.params = {
            status: this.status,
            createdFrom: val,
            createdEnd: this.end_time,
            settleMethod: this.settleMethodType
          }
        } else {
          this.start_time = ''
          this.end_time = ''
          this.$toast.fail('开始时间不得大于结束时间')
        }
      }
    },
    end_time(val) {
      if (val && this.start_time) {
        if (new Date(val) > new Date(this.start_time)) {
          this.params = {
            status: this.status,
            createdFrom: this.start_time,
            createdEnd: val,
            settleMethod: this.settleMethodType
          }
        } else {
          this.start_time = ''
          this.end_time = ''
          this.$toast.fail('结束时间不得小于于开始时间')
        }
      }
    },
    settleMethodType(val) {
      this.params = {
        status: this.status,
        createdFrom: this.start_time,
        createdEnd: this.end_time,
        settleMethod: val
      }
    },
    isReset(val){
      if(val){
        this.params = {
          status: this.status,
          settleMethod: this.settleMethodType
        }
        this.isReset = false
      }
    }
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
    },
    tab_list() {
      let arr = [
        {
          title: "全部",
          status: "",
        },
        {
          title: "未审核",
          status: '20',
        },
        {
          title: "待付款",
          status: '10',
        },
        {
          title: "订单取消",
          status: '50',
        },
        {
          title: "审核拒绝",
          status: '30',
        },
        {
          title: "报告未出",
          status: '40',
        },
        {
          title: "报告已出",
          status: '60',
        },
      ]
      if (this.roleType === 2) {
        arr.splice(1, 3)
      }
      return arr
    },

    isShowTotalPrice(){
      if(this.start_time&&this.end_time){
        return true
      }else{
        return false
      }
    }
  },
  created() {
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    timeIsConfirm(time) {
      this.showPicker = false
      this.currentDate = time
      if (this.type === 'start_time') {
        this.start_time = getFormatDate(time, 'ymd', '/')
      } else {
        this.end_time = getFormatDate(time, 'ymd', '/')
      }
    },
    chooseTime(type) {
      this.type = type
      this.showPicker = true
    },
    time_reset() {
      this.currentDate = new Date();
      this.start_time = ''
      this.end_time = ''
      this.type = ''
      this.isReset = true
    },
    chooseType(type) {
      this.status = type
    },
    chooseSettleMethod(type) {
      this.settleMethodType = type
    },
    _getTotalAmount(price){
      this.totalAmount = price
    }
  },
};
</script>
<style scoped lang="scss">
.order-search-box {
  //height: 317px;
  background: #fff;
  padding: 32px;

  .order-search-time-box {
    display: flex;
    align-items: center;

    .order-search-time {
      width: 550px;
      height: 68px;
      background: #F7F8FA;
      border-radius: 8px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      padding-left: 24px;

      > i {
        width: 32px;
        height: 32px;
        display: inline-block;
        background-image: url("../assets/tine-search.png");
        background-size: 100% 100%;
        margin-right: 16px;
      }

      .order-search-title {
        color: #1DAEC3;
        font-size: 28px;
        width: 200px;
        line-height: 32px;
        margin-right: 16px;
        border: none;
        background-color: transparent;
      }

      ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: #919EAB;
      }

      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #919EAB;
      }

      ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #919EAB;
      }

      :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #919EAB;
      }

      .order-search-txt {
        color: #333;
        font-size: 28px;
        font-weight: bold;
        margin-right: 16px;
      }
    }

    .order-search-time-btn {
      width: 120px;
      height: 68px;
      background: #FFFFFF;
      border-radius: 8px;
      border: 1px solid #1DAEC3;
      text-align: center;
      line-height: 70px;
      box-sizing: border-box;
      color: #1DAEC3;
    }
  }

  .order-search-type-box {
    display: flex;
    flex-wrap: wrap;

    > div {
      background: #F7F8FA;
      border-radius: 8px;
      padding: 17px 32px 15px 32px;
      color: #919EAB;
      font-size: 28px;
      text-align: center;
      margin-top: 24px;
      margin-right: 20px;
    }

    > div.active {
      background: #21AEC3;
      color: #fff;
    }
  }
}

.order-total-box {
  height: 166px;
  background-color: #fff;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  .order-total {
    color: #333;
    font-size: 24px;
    padding-top: 24px;
    padding-right: 32px;
    text-align: right;
    display: flex;
    align-items: baseline;
    justify-content: flex-end;

    .order-unit {
      color: #17AFC3;
      font-size: 24px;
    }

    .order-price {
      color: #17AFC3;
      font-size: 48px;
    }
  }
}

</style>
