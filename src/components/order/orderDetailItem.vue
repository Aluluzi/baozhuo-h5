<template>
 <div class="orderDetailItem">
    <p class="item-title">{{ name }}</p>
   <div class="item-info">
     <p class="item-pay-price">
       实际支付:
       <span class="item-pay-price-unit">￥</span>
       <span class="item-pay-price-num">{{ payment / 100 }}</span>
     </p>
     <p class="item-price">
       <span>项目费用:</span>
       <s>￥{{ price / 100 }}</s>
     </p>
   </div>
 </div>
</template>

<script>
export default {
    name: "orderDetailItem",
    components:{},
  props:['data','name','payment','price'],
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
    .orderDetailItem{
      padding: 32px;
      background-color: rgba(33, 174, 195, .05);
      .item-title{
        color: #333;
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 24px;
      }
      .item-info{
        display: flex;
        align-items: baseline;
        .item-pay-price{
          color: #333;
          font-size: 24px;
          margin-right: 32px;
          .item-pay-price-unit{
            color: #17AFC3;
            font-size: 24px;
          }
          .item-pay-price-num{
            color: #17AFC3;
            font-size: 48px;
          }
        }
        .item-price{
          color: #919EAB;
          font-size: 24px;
        }
      }
    }
</style>