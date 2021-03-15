<template>
  <div class="order">

    <div class="order-search-box">
      <div class="order-search-time-box">
        <van-search v-model="patientKey" placeholder="请输入病人姓名/手机号"/>
        <div class="order-search-time-btn" @click="search">搜索</div>
        <div class="order-search-time-btn reset" @click="reset">重置</div>
      </div>
      <div class="order-search-time-box">
        <div class="order-search-time">
          <i></i>
          <input class="order-search-title van-ellipsis active" placeholder="开始时间" v-model="start_time"
                 @click="chooseTime('start_time')" readonly>
          <span class="order-search-txt">至</span>
          <input class="order-search-title van-ellipsis active" placeholder="结束时间" v-model="end_time"
                 @click="chooseTime('end_time')" readonly>
        </div>
        <div class="status-box" @click="isShowPickerStatus = true">
          <span class="van-ellipsis">{{ status.value }}</span>
          <i></i>
        </div>
      </div>
      <!--      <div class="order-search-type-box">-->
      <!--        <div v-for="(item,index) in tab_list" :key="index" :class="status===item.status?'active':''"-->
      <!--             @click="chooseType(item.status)">{{ item.title }}-->
      <!--        </div>-->
      <!--      </div>-->
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

    <van-popup v-model="isShowPickerStatus" round position="bottom">
      <van-picker
          show-toolbar
          value-key="value"
          :columns="tab_list"
          @cancel="isShowPickerStatus = false"
          @confirm="statusIsConfirm"
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

      // status: "",//状态
      settleMethodType: "",//日结月结
      isReset: false,

      settleMethod_list: [{title: '日结', value: '1'}, {title: '月结', value: '2'}],
      showPicker: false,
      currentDate: new Date(),
      start_time: '',
      end_time: '',
      type: '',
      patientKey: '',
      params: {},//查询参数
      totalAmount: 0,
      isShowPickerStatus: false,
      status: {
        value: '全部',
        key: "",
      }
    };
  },
  watch: {
    // status(val) {
    //   this.params = {
    //     status: val,
    //     createdFrom: this.start_time,
    //     createdEnd: this.end_time,
    //     settleMethod: this.settleMethodType
    //   }
    // },
    start_time(val) {
      if (val && this.end_time) {
        if (new Date(val) < new Date(this.end_time)) {
          // this.params = {
          //   status: this.status,
          //   createdFrom: val,
          //   createdEnd: this.end_time,
          //   settleMethod: this.settleMethodType
          // }
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
          // this.params = {
          //   status: this.status,
          //   createdFrom: this.start_time,
          //   createdEnd: val,
          //   settleMethod: this.settleMethodType
          // }
        } else {
          this.start_time = ''
          this.end_time = ''
          this.$toast.fail('结束时间不得小于于开始时间')
        }
      }
    },
    // settleMethodType(val) {
    //   this.params = {
    //     status: this.status,
    //     createdFrom: this.start_time,
    //     createdEnd: this.end_time,
    //     settleMethod: val
    //   }
    // },
    // isReset(val){
    //   if(val){
    //     this.params = {
    //       status: this.status,
    //       settleMethod: this.settleMethodType
    //     }
    //     this.isReset = false
    //   }
    // }
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
          value: "全部",
          key: "",
        },
        {
          value: "未审核",
          key: '20',
        },
        {
          value: "待付款",
          key: '10',
        },
        {
          value: "订单取消",
          key: '50',
        },
        {
          value: "审核拒绝",
          key: '30',
        },
        {
          value: "报告未出",
          key: '40',
        },
        {
          value: "部分报告已出",
          key: '45',
        },
        {
          value: "报告已出",
          key: '60',
        },

      ]
      if (this.roleType === 2) {
        arr.splice(1, 3)
      }
      return arr
    },

    isShowTotalPrice() {
      if (this.start_time && this.end_time) {
        return true
      } else {
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
    // time_reset() {
    //   this.currentDate = new Date();
    //   this.start_time = ''
    //   this.end_time = ''
    //   this.type = ''
    //   this.isReset = true
    // },
    // chooseType(type) {
    //   this.status = type
    // },
    chooseSettleMethod(type) {
      this.settleMethodType = type
    },
    _getTotalAmount(price) {
      this.totalAmount = price
    },
    statusIsConfirm(value) {
      this.status = value
      this.isShowPickerStatus = false
    },
    search() {
      this.params = {
        status: this.status.key,
        createdFrom: this.start_time,
        createdEnd: this.end_time,
        patientKey:this.patientKey,
        settleMethod: this.settleMethodType
      }
      console.log('search')
    },
    reset() {
      this.currentDate = new Date();
      this.start_time = ''
      this.end_time = ''
      this.status = {
        value: '全部',
        key: "",
      }
      this.patientKey = ''

      this.params = {
        status: '',
        createdFrom: "",
        createdEnd: "",
        patientKey:'',
        settleMethod: "",
      }
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

    &:first-child {
      margin-bottom: 24px;
    }

    .order-search-time {
      width: 449px;
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
        flex-shrink: 0;
      }

      .order-search-title {
        color: #1DAEC3;
        font-size: 28px;
        width: 150px;
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
      width: 100px;
      height: 68px;
      background: #1DAEC3;
      border-radius: 8px;
      //border: 1px solid #1DAEC3;
      text-align: center;
      line-height: 70px;
      box-sizing: border-box;
      color: #fff;
      font-size: 28px;
      margin-left: 12px;
    }
    .order-search-time-btn.reset{
      color: #1DAEC3;
      border: 1px solid #1DAEC3;
      background: #fff;
    }

    .status-box {
      width: 221px;
      height: 68px;
      border-radius: 8px;
      background-color: #F7F8FA;
      display: flex;
      align-items: center;
      padding: 14px 20px;
      box-sizing: border-box;

      > span {
        color: #1DAEC3;
        font-size: 28px;
        line-height: 36px;
        flex: 1;
      }

      > i {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        background-size: 100% 100%;
        background-image: url("../assets/xiala.png");
      }
    }
  }

  .order-search-type-box {
    display: flex;
    flex-wrap: wrap;

    > div {
      background: #F7F8FA;
      border-radius: 8px;
      padding: 12px 15px 10px 15px;
      color: #919EAB;
      font-size: 28px;
      text-align: center;
      margin-top: 12px;
      margin-right: 12px;
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
