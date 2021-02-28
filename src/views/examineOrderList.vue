<template>
 <div class="examineOrderList">
   <examineOrderLists/>
 </div>
</template>

<script>
import examineOrderLists from "_c/examine/examineOrderList";
export default {
    name: "examineOrderList",
    components:{
      examineOrderLists
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
    }
</style>