<template>
  <div class="classify">
    <div class="classify-sidebar">
      <van-sidebar v-model="activeKey">
        <van-sidebar-item
            class="collection-tips"
            title="常用/收藏"
            @click="changeSidebar(-1)"
        />
        <van-sidebar-item
            :title="item.name"
            @click="changeSidebar(item.id)"
            v-for="(item, index) in categoryList"
            :key="index"
        />
      </van-sidebar>
    </div>
    <div class="classify-list" ref="right_srcoll">
      <van-list
          :finished="finished"
          :finished-text="finishedText"
          :immediate-check="false"
          @load="onLoad"
          v-model="loading"
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
import {getCategoryList, getInspectionItemList, getFavoriteList, addFavoriteItem, cancelFavoriteItem} from '@/api'
import GoodsItem from "@/components/goods/GoodsItem.vue";

export default {
  name: "labList",
  components: {
    GoodsItem
  },
  props: ['labId', 'orderGoodsList'],
  data() {
    return {
      // categoryList: [{
      //   name: '常用/收藏',
      //   id: -1
      // }],
      categoryList: [],

      finished: false,
      finishedText: "",
      nodata: false,
      loading: false,
      list: [],
      // list: [{isCheck: true, isFavorite: false}, {isCheck: false, isFavorite: true}],

      page: 1,
      page_size: 10,
      categoryId: null,
      activeKey: 0,
      checkList:[],
      // cartList:[],
    }
  },
  watch:{
    orderGoodsList(val){
      this.checkList = val
    }
  },
  computed: {
    // cartList(){
    //   // console.log(this.orderGoodsList)
    //   return this.orderGoodsList
    // }
  },
  created() {
  },
  mounted() {
    this.getCategoryList()
  },
  destroy() {
  },
  methods: {
    getCategoryList() {
      getCategoryList({
        labId: this.labId,
        size: 10
      }).then(res => {
        const arr = res.data.map(item => {
          return {
            name: item.name,
            id: item.id
          }
        })
        // this.categoryList.push(...arr)
        this.categoryList = [...arr]
        // this.onLoad(this.categoryList[0].id)
        this.onLoad(-1)
      })
    },
    changeSidebar(id, index) {
      this.list = []
      this.onLoad(id)
    },

    onLoad(id) {
      let params = {
        size: this.page_size,
        page: this.page,
        labId: this.labId,
        categoryId: id,
      };

      if (id < 0) {//收藏
        getFavoriteList().then(res => {
          const arr = res.map(item => {
            let isCheck = false
            for(let k of this.checkList){
              if(item.id===k.id){
                isCheck = true
              }
            }
            return {
              ...item,
              isCheck: isCheck,
            }
          })

          this.list = arr
        })
      } else {
        getInspectionItemList(params).then(res => {
          this.setData(res)
        })
      }

    },

    setData(res){
      if (res.data.length > 0) {
        const arr = res.data.map(item => {
          let isCheck = false
          for(let k of this.checkList){
            if(item.id===k.id){
              isCheck = true
            }
          }
          return {
            ...item,
            isCheck: isCheck,
          }
        })
        this.list = this.list.concat(arr)

        const row = Math.ceil(res.total / this.page_size)
        this.list.length === 0 ?
            (this.finishedText = "") :
            (this.finishedText = "没有更多了");

        if (this.page >= row) {
          // 数据全部加载完成
          this.finished = true;
          if (this.list.length === 0) {
            this.nodata = true;
          }
        }
        this.page_no++;

      } else {
        this.finishedText = ""
        this.loading = false;
        this.finished = true;
      }
    },
    _check(index) {
      this.list[index].isCheck = !this.list[index].isCheck
      this.$set(this.list,index,this.list[index])

      console.log(index)
      if(this.list[index].isCheck){
        this.checkList.push(this.list[index])
        this.$emit('check',{
          checkList:this.checkList
        })
      }else{
        for(let k in this.checkList){
          if(this.list[index].id===this.checkList[k].id){
            this.checkList.splice(k,1)
          }
        }
        this.$emit('check',{
          checkList:this.checkList
        })
      }
    },
    _collection(index) {
      this.list[index].isFavorite = !this.list[index].isFavorite
      this.$set(this.list,index,this.list[index])
      if(this.list[index].isFavorite){
        addFavoriteItem({
          id:this.list[index].id
        }).then(res=>{
          if(res){
            this.$toast("收藏成功")
          }
        })
      }else{
        cancelFavoriteItem({
          id:this.list[index].id
        }).then(res=>{
          if(res){
            this.$toast("已取消收藏")
          }
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.classify {
  display: flex;
  align-items: flex-start;
}

.classify-sidebar {
  min-width: 226px;
  height: calc(100vh - 202px);
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

}

.classify-list {
  /*width: 590px;*/
  width: calc(100% - 226px);
  //padding-bottom: 128px;
  height: calc(100vh - 202px);
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #fff;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>