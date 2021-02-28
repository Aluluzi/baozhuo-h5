<template>
 <div class="examineOrderItem">
   <orderDetailItem/>
 </div>
</template>

<script>
import orderDetailItem from "_c/order/orderDetailItem";
export default {
    name: "examineOrderItem",
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
    .examineOrderItem{
      padding: 32px;
      background-color: #fff;
    }
</style>