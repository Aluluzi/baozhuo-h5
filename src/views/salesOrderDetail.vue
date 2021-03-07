<template>
  <div class="salesOrderDetail">
    <div class="order-content">
      <!--订单信息-->
      <div class="order-info">
        <p class="order-info-sn">
          <span>订单编号：{{ orderId }}</span>
          <span>{{ labName }}</span>
        </p>
        <orderDetailItem v-for="(item,index) in orderList" :key="index" :data="item" :name="item.name"
                         :payment="item.payment" :price="item.price" class="order-item"/>

        <p class="edit" @click="edit_material">编辑条码</p>
        <orderDetailMaterial :list="materialList"/>

        <div class="order-pay-price">
          <p class="order-item-num">
            共{{ orderList.length }}个检测项目
          </p>
          <p class="item-pay-price">
            实际支付:
            <span class="item-pay-price-unit">￥</span>
            <span class="item-pay-price-num">{{ payPrice / 100 }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="order-item-other-box">
      <p class="edit order-item-other-box-edit" @click="edit_info">编辑信息</p>
      <div class="order-item-other-content">
        <infoCell v-for="(item,index) in infoList" :key="index" class="van-hairline--bottom" :title="item.title"
                  :value="item.value"/>
      </div>
    </div>

    <div class="order-item-other-box">
      <div class="order-item-other-content">
        <infoCell v-for="(item,index) in timeList" :key="index" class="van-hairline--bottom" :title="item.title"
                  :value="item.value"/>
      </div>
    </div>


    <FootbtnTwo
        left_text="拒绝"
        right_text="通过"
        :disabled="false"
        @click_left_btn="examine(0)"
        @click_right_btn="examine(1)"
    />
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";

Vue.prototype.$http = axios;
import {mapState} from "vuex";
import {baseURL} from "@/config";
import store from "@/store";
import orderDetailItem from "_c/order/orderDetailItem";
import orderDetailMaterial from "_c/order/orderDetailMaterial";
import infoCell from '@/components/InfoCell'
import FootbtnTwo from "@/components/FootbtnTwo";
import {addTrade,tradeExamine} from "@/api";

export default {
  name: "salesOrderDetail",
  components: {
    orderDetailItem,
    orderDetailMaterial,
    infoCell,
    FootbtnTwo
  },
  data() {
    return {
      id: null,

      orderList: [],
      materialList: [],
      infoList: [],
      timeList: [],
      patient:{},
      samplingTime:'',

      status: {},
      status_id: null,
      orderId: '',
      labName: '',
      payPrice: 0,
      doctorName: '',

      orderListRequestUrl:baseURL+'/api/trade/',
      // orderListRequestUrl:'http://localhost:8080/apis/api/trade/',

    }
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
  },
  created() {
    let {
      token
    } = store.state.tokenInfo;
    axios.defaults.headers.Authorization = token;

    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getData();
    } else {
      this.$toast("数据加载错误，请稍后重试");
    }
  },
  activated() {

    const {editTubes, editPatientInfo} = this.$store.state
    if(Object.keys(editTubes).length>0){
      this.materialList = editTubes
    }
    if(Object.keys(editPatientInfo).length>0){
      this.samplingTime = editPatientInfo.samplingTime
      this.patient = editPatientInfo.patient

      this.infoList = [
        {title: '姓名', value: this.patient.name},
        {title: '年龄', value: this.patient.age},
        {title: '性别', value: this.patient.sex === 'F' ? '女' : '男'},
        {title: '手机号码', value: this.patient.phone},
        {title: '送检医生', value: this.doctorName},
      ]
      this.$set(this.timeList, 0, {title: '采样时间', value: this.samplingTime})
    }


  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    //订单详情
    getData() {
      const _this = this;
      this.$http
          .post(this.orderListRequestUrl + this.id, {header: 'token'})
          .then(function (res) {
            if (res.data.code === 200) {
              const datas = res.data.data
              _this.status_id = datas.status
              _this.status = _this.formatStatus(datas.status)
              _this.orderId = datas.id
              _this.labName = datas.labName
              _this.payPrice = datas.payAmount

              _this.orderList = datas.orders
              _this.materialList = datas.tubes

              _this.samplingTime = datas.samplingTime
              _this.doctorName = datas.doctorName
              _this.patient = datas.patient

              _this.infoList = [
                {title: '姓名', value: datas.patient.name},
                {title: '年龄', value: datas.patient.age},
                {title: '性别', value: datas.patient.sex === 'F' ? '女' : '男'},
                {title: '手机号码', value: datas.patient.phone},
                {title: '送检医生', value: datas.doctorName},
              ]
              _this.timeList = [
                {title: '采样时间', value: datas.samplingTime},
                {title: '下单时间', value: datas.created},
                {title: '付款时间', value: datas.payTime},
              ]
            }
          })
          .catch(function (res) {
            _this.$toast(res.message);
          });
    },
    formatStatus(status) {
      let obj = {}
      switch (status) {
        case 0:
          obj.className = 'order-info-status-qx'
          obj.statusName = '已关闭'
          break;
        case 10:
          obj.className = 'order-info-status-dfk'
          obj.statusName = '待付款'
          break;
        case 20:
          obj.className = 'order-info-status-wsh'
          obj.statusName = '未审核'
          break;
        case 30:
          obj.className = 'order-info-status-jj'
          obj.statusName = '审核拒绝'
          break;
        case 40:
          obj.className = 'order-info-status-bbwc'
          obj.statusName = '报告未出'
          break;
        case 50:
          obj.className = 'order-info-status-qx'
          obj.statusName = '订单取消'
          break;
        case 60:
          obj.className = 'order-info-status-bbyc'
          obj.statusName = '报告已出'
          break;
      }
      return obj;
    },

    edit_material(){
      this.$router.push({
        path:'/editCode',
        name:'editCode',
        query:{
          type:2//1医生下单，2业务员编辑
        },
        params:{
          materialList:this.materialList
        }
      })
    },
    edit_info(){
      this.$router.push({
        path:'/editInfo',
        name:'editInfo',
        query:{
          type:2//1医生下单，2业务员编辑
        },
        params:{
          patient:this.patient,
          samplingTime:this.samplingTime,
          doctorName:this.doctorName
        }
      })
    },

    examine(type){
      if(type===0){//拒绝
        console.log(type)
        this.$dialog.confirm({
          title: '审核拒绝',
          message: '确定拒绝驳回审核吗？',
          confirmButtonText: '确定',
          confirmButtonColor: '#21AEC3'
        })
            .then(() => {
              this.submit(type)
            })
            .catch(() => {
            });
      }else{//通过
        // if(){}
        console.log(this.materialList)
        let isConfirm = true
        for(let k of this.materialList){
          if(!k.barCode){
            isConfirm = false
          }
        }
        if(isConfirm){
          this.$dialog.confirm({
            title: '审核通过',
            message: '确定通过审核吗？',
            confirmButtonText: '确定',
            confirmButtonColor: '#21AEC3'
          })
              .then(() => {
                this.submit(type)
              })
              .catch(() => {
              });

          // this.submit(type)
        }else{
          this.$toast('没有填写条码！')
        }
      }
    },
    submit(type){
      tradeExamine({
        id: +this.id,
        status:type,
        patient:this.patient,
        tubes:this.materialList,
        samplingTime:this.samplingTime
      }).then(res=>{
        this.$toast('审核成功')
        history.go(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.salesOrderDetail {
  padding-bottom: 210px;
  .order-content {
    width: 100%;
    box-sizing: border-box;
    background: #fff;

    .order-info {
      padding: 32px;
      background: #fff;
      border-radius: 20px;
      margin-top: 20px;
      overflow: hidden;

      .order-info-status {
        color: #FE9838;
        font-size: 40px;
        margin-bottom: 24px;
      }

      .order-info-status-dfk {
        color: #FE9838;
      }

      .order-info-status-wsh {
        color: #ADB6BA;
      }

      .order-info-status-qx {
        color: #919EAB;
      }

      .order-info-status-jj {
        color: #ED5353;
      }

      .order-info-status-bgwc {
        color: #3858E6;
      }

      .order-info-status-bgyc {
        color: #1DAEC3;
      }

      .order-info-sn {
        color: #333;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .order-item {
        margin-bottom: 16px;
      }

      .order-info-box {
        padding-left: 30px;
      }

      .order-pay-price {
        text-align: right;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        margin-top: 40px;

        .order-item-num {
          color: #9D9D9D;
          font-size: 28px;
          margin-right: 32px;
        }

        .item-pay-price {
          color: #333;
          font-size: 24px;
          margin-right: 32px;

          .item-pay-price-unit {
            color: #17AFC3;
            font-size: 24px;
          }

          .item-pay-price-num {
            color: #17AFC3;
            font-size: 48px;
          }
        }
      }

      .van-hairline--top-bottom:after,
      .van-hairline-unset--top-bottom:after {
        display: none;
      }
    }

  }
  .order-item-other-box {
    padding-top: 32px;
    .order-item-other-box-edit{
      padding-right: 32px;
    }

    .order-item-other-title {
      color: #333;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 24px;
    }

    .order-item-other-content {
      background: #fff;
      padding: 0 32px;
    }

    .doc-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100px;
      .doc-clinic{
        color: #9D9D9D;
        font-size: 28px;
        flex: 1;
        text-align: left;
      }
      .doc-name{
        color: #333;
        font-size: 28px;
        flex: 1;
        text-align: right;
      }
    }
  }


  .edit{
    color: #1CAEC3;
    font-size: 28px;
    text-align: right;
    line-height: 40px;
  }
}
</style>