<template>
  <div class="checkOrderInfo">
    <van-cell-group class="group info1">
      <van-cell v-for="(item,index) in orderList" :key="index" :title="item.name" :value="item.price/100"/>
    </van-cell-group>
    <van-cell-group class="group info2">
      <van-cell v-for="(item,index) in tubesList" :key="index" :value="item.code">
        <template #title>
          <span class="tubes-name">{{item.name}}</span>
          <span class="tubes-num">x{{ item.num }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="group info3-box">
      <p class="info3 van-hairline--bottom" v-for="(item,index) in formatPatientInfo" :key="index">
        <span class="title">{{ item.name }}</span>
        <span class="value van-ellipsis">{{ item.value }}</span>
      </p>
    </div>

    <div class="btn-box">
      <p>注：该样本将送往{{ orderList[0].labName }}检验</p>
      <Footbtn text="去支付" @click_btn="toPay" :disabled="false"/>
    </div>
  </div>
</template>

<script>
import Footbtn from "@/components/Footbtn";

export default {
  name: "checkOrderInfo",
  components: {
    Footbtn
  },
  data() {
    return {
      orderList: [],
      tubesList: [],
      patientInfo: {},
      formatPatientInfo: [],
    }
  },
  computed: {},
  created() {
    const {orderList, tubesList, patientInfo} = this.$store.state
    debugger

    this.orderList = orderList
    this.tubesList = tubesList
    this.patientInfo = patientInfo

    this.formatPatientInfo = [{
      name: '姓名',
      value: patientInfo.name
    }, {
      name: '年龄',
      value: patientInfo.age
    }, {
      name: '性别',
      value: patientInfo.sex === 'M' ? '男' : '女'
    }, {
      name: '手机号码',
      value: patientInfo.phone
    }, {
      name: '采样时间',
      value: patientInfo.samplingTime
    }, {
      name: '送检医生',
      value: patientInfo.docName
    }]
  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    toPay(){
      this.$router.push({
        path:'/pay',
        name:'pay',
        params: {
          orderList: this.orderList,
          tubesList: this.tubesList,
          patientInfo: this.patientInfo
        }
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.checkOrderInfo {
  padding-top: 16px;

  .group {
    margin-bottom: 16px;
  }


  .info3-box {
    padding: 0 32px;
    background: #fff;

    .info3 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      > .title {
        color: #9D9D9D;
        font-size: 28px;
        line-height: 88px;
        height: 88px;
        display: inline-block;
        text-align: justify;
        width: 112px !important;
      }

      > .title:after {
        display: inline-block;
        width: 100%;
        content: '';
      }

      > .value {
        color: #333;
        font-size: 28px;
        max-width: 50%;
      }
    }
  }

  .btn-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 32px 78px;

    > p {
      text-align: center;
      color: #21AEC3;
      font-size: 24px;
      margin-bottom: 23px;

    }
  }
}

</style>