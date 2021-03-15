<template>
 <div>
   <van-sticky>
     <form action="/">
       <van-search
           v-model="key"
           maxlength="15"
           placeholder="搜索药品名、助记码、厂家、国药准字"
           background="#ffffff"
           show-action
           autofocus
           :class="themeInfo.theme_color_class"
           @cancel="onCancel"
       >
         <div slot="left-icon" class="img-box">
           <van-icon :name="searcher_src" />
         </div>
       </van-search>
     </form>
   </van-sticky>
   <div>
     <van-list
         v-model="loading"
         :finished="finished"
         :finished-text="finishedText"
         @load="onLoad"
     >
       <div class="extension-item-box">
         <goods-item
             :data="item"
             :index="index"
             :key="index"
             v-for="(item, index) in list"
             @_check="_check"
             @_collection="_collection"
         ></goods-item>
       </div>
     </van-list>
     <van-empty description="空空如也~" v-if="list.length <= 0"/>
   </div>
 </div>
</template>

<script>
export default {
    name: "searcher",
    components:{},
    data() {
        return {

          finished: true,
          finishedText: "",
          nodata: false,
          loading: false,
          list: [],

          page: 1,
          page_size: 10,
          categoryId: -1,
          activeKey: 0,
          checkList:[],
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
    
</style>