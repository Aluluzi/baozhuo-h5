<template>
 <div class="examineOrderList">
   <p class="examineOrderList-top">
     <span>订单编号：DJ565456453</span>
     <span>2020/12/12 12:22:23</span>
   </p>
   <orderDetailItem/>
   <p class="examineOrderList-info">大傻几/男/24岁</p>
 </div>
</template>

<script>
import orderDetailItem from "_c/order/orderDetailItem";
export default {
    name: "examineOrderList",
    components:{
      orderDetailItem
    },
    data() {
        return {
        
        }
    },
    computed:{},
    created(){},
    mounted(){},
    destroy(){},
    methods:{
    }
}
</script>

<style lang="scss" scoped>
    .examineOrderList{
      padding: 32px;
      background: #fff;
      .examineOrderList-top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        >span:first-child{
          color: #333;
          font-size: 24px;
        }
        >span:last-child{
          color: #ADB6BA;
          font-size: 24px;
        }
      }
      .examineOrderList-info{
        color: #333;
        font-size: 28px;
        margin-top: 24px;
      }
    }
</style>