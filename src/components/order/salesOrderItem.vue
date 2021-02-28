<template>
  <div class="salesOrderItem" @click="link(data.id)">
    <p class="salesOrderItem-topInfo">
      <span class="item-num">订单编号：{{ data.id }}</span>
      <span class="item-time">{{ data.created }}</span>
    </p>
    <orderDetailItem :name="orderInfo.name" :payment="orderInfo.payment" :price="orderInfo.price"/>
    <p class="item-userInfo">{{ data.patient.name }}/{{ data.patient.sex === 'M' ? '男' : '女' }}/{{
        data.patient.age
      }}岁</p>
  </div>
</template>

<script>
import orderDetailItem from '@/components/order/orderDetailItem'

export default {
  name: "salesOrderItem",
  components: {
    orderDetailItem
  },
  props: ['data'],
  data() {
    return {}
  },
  computed: {
    orderInfo() {
      const {orders, totalAmount, payAmount} = this.data;
      const arr = orders.map(item => {
        return item.name
      })

      return {
        name: arr.join('、'),
        payment: payAmount,
        price: totalAmount
      }
    }
  },
  created() {
  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    link(id) {
      this.$router.push({
        path: "/salesOrderDetail",
        query: {
          id: id,
        },
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.salesOrderItem {
  background: #fff;
  padding: 32px;
  margin-bottom: 24px;

  .salesOrderItem-topInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .item-num {
      color: #333;
      font-size: 24px;
    }

    .item-time {
      color: #ADB6BA;
      font-size: 24px;
    }
  }

  .item-userInfo {
    color: #333;
    font-size: 28px;
    margin-top: 24px;
  }
}
</style>