<template>
 <div class="clinicList">
   <clinicItem class="clinic-item" v-for="(item,index) in list" :data="item" :key="index"/>
 </div>
</template>

<script>
import clinicItem from "@/components/clinicItem";
import {getClinicList} from '@/api/index'

export default {
    name: "clinicList",
    components:{
      clinicItem
    },
    data() {
        return {
          list:[]
        }
    },
    computed:{},
    created(){
      this.getInfo()
    },
    mounted(){},
    destroy(){},
    methods:{
      getInfo(){
        getClinicList({
          size:9999,
          page:1,
        }).then(res=>{
          if(res){
            this.list = [...res.data]
          }
        })
      }
    }
}
</script>

<style lang="scss" scoped>
    .clinicList{
      padding: 32px;
      .clinic-item{
        margin-bottom: 24px;
      }
    }
</style>