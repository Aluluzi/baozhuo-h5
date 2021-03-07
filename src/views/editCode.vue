<template>
  <div class="editCode">
    <div v-for="(item,index) in list" :key="index">
      <materialItem :list="item" :index="index"></materialItem>
    </div>
    <div class="btn-box">
      <Footbtn v-if="type==1" text="下一步" @click_btn="next" :disabled="false"/>
      <Footbtn v-if="type==2" text="保存" @click_btn="save" :disabled="false"/>
    </div>
  </div>
</template>

<script>
import materialItem from '@/components/order/materialItem'
import Footbtn from '@/components/Footbtn'


export default {
  name: "editCode",
  components: {
    materialItem,
    Footbtn
  },
  data() {
    return {
      type: null,//1医生下单，2业务员编辑


      list: [],
      tubes: [],
      materialList: [],
    }
  },
  computed: {},
  created() {
    const {type} = this.$route.query
    const {materialList} = this.$route.params
    this.type = type
    this.materialList = materialList
    if (type == 1) {//医生下单
      const orderList = this.$store.state.orderList
      const tubeList = [];
      for (let k of orderList) {
        const arr = k.Tubes || []
        for (let item of arr) {
          tubeList.push(item)
        }
      }
      this.list = this.quchong(tubeList)
    }
    if (type == 2) {//业务员编辑
      this.list = materialList.map(item => {
        return {
          ...item,
          img: item.tubeImg,
          name: item.tubeName,
          num: item.tubeNum,
          code: item.barCode
        }
      })
      console.log('editcode',materialList)
      console.log(this.list)
    }
  },
  mounted() {
  },
  destroy() {
  },
  methods: {
    next() {
      const {type} = this.$route.query
      this.$store.dispatch("saveTubesList", this.list);
      this.$router.push({
        path: '/editInfo',
        query:{
          type: type
        }
      })
    },
    quchong(arr) {
      //  第一步，去重
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].id === arr[j].id) {
            ++i;
            j = i;
          }
        }
        arr[i].num = 0;
        hash.push(arr[i]);
      }
      // 第二步，统计重复个数
      hash.forEach(item => {
        arr.forEach(dd => {
          if (item.id === dd.id) {
            item.num++
          }
        })
      });
      return hash;
    },
    save() {
      const list = this.list.map(item => {
        item.tubeImg = item.img
        item.tubeName = item.name
        item.tubeNum = item.num
        item.barCode = item.code
        delete item.img
        delete item.name
        delete item.num
        delete item.code
        return {
          ...item
        }
      })
      this.$store.dispatch("saveEditTubes", list);
      history.go(-1)
    },
  }
}
</script>

<style lang="scss" scoped>
.editCode {
  padding: 32px;

  .btn-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 32px 78px;
  }
}
</style>