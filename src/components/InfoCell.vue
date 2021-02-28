<template>
 <div class="info-cell">
   <span class="title">{{ title }}</span>
   <span class="value van-ellipsis">{{ value }}</span>
 </div>
</template>

<script>
export default {
    name: "InfoCell",
    components:{},
  props:['title','value'],
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
    .info-cell{
      display: flex;
      align-items: center;
      justify-content: space-between;
      >.title{
        color: #9D9D9D;
        font-size: 28px;
        line-height: 88px;
        height: 88px;
        display: inline-block;
        text-align: justify;
        width: 112px!important;
      }
      >.title:after{
        display: inline-block;
        width: 100%;
        content:'';
      }
      >.value{
        color: #333;
        font-size: 28px;
        max-width: 50%;
      }
    }
</style>