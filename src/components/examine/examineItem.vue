<template>
  <div class="examineItem" @click="link(data.doctorId, data.clinic.id)">
    <div class="examine-order-info">
      <p class="examine-order-hospital">{{ data.clinic.name }}({{ data.clinic.id }})</p>
      <p class="examine-order-doctor">{{ data.doctorName }}</p>
    </div>
    <p class="examine-order-txt">
      <span>您有</span>
      <span class="examine-order-num">{{ data.num }}</span>
      <span>笔订单待处理</span>
      <i class="examine-order-link"></i>
    </p>
  </div>
</template>

<script>
export default {
  name: "examineItem",
  components: {},
  props: ['data'],
  data() {
    return {}
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    link(doctorId,clinicId){
      this.$router.push({
        path:'/salesOrderList',
        query:{
          doctorId:doctorId,
          clinicId:clinicId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.examineItem {
  padding: 32px 24px 24px 32px;
  background: #ffff;
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  .examine-order-info {
    text-align: left;
    flex: 1;

    .examine-order-hospital {
      color: #ADB6BA;
      font-size: 28px;
      margin-bottom: 16px;
    }

    .examine-order-doctor {
      color: #333;
      font-size: 40px;
    }
  }

  .examine-order-txt {
    flex: 1;
    color: #ADB6BA;
    font-size: 28px;
    display: flex;
    align-items: center;

    .examine-order-num {
      color: #21AEC3;
    }

    .examine-order-link {
      width: 32px;
      height: 32px;
      margin-left: 8px;
      display: inline-block;
      background-size: 100% 100%;
      background-image: url("../../assets/back.png");
    }
  }
}
</style>