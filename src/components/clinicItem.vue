<template>
 <div class="clinicItem">
   <a :href="'tel:'+data.contactPhone">
     <p class="clinic-name">{{data.name}}</p>
     <p class="clinic-num">诊所编号： {{data.id}}</p>

     <div class="clinic-info-box">
       <p class="clinic-info">
         <i class="clinic-info-logo clinic-info-logo-user"></i>
         <span class="clinic-info-txt">{{data.contactName}}</span>
       </p>
       <p class="clinic-info">
         <i class="clinic-info-logo clinic-info-logo-phone"></i>
         <span class="clinic-info-txt">{{data.contactPhone}}</span>
       </p>
     </div>
   </a>
 </div>
</template>

<script>

export default {
    name: "clinicItem",
    components:{},
  props:['data'],
    data() {
        return {
        }
    },
    computed:{},
    created(){
    },
    mounted(){},
    destroy(){},
    methods:{
    }
}
</script>

<style lang="scss" scoped>
    .clinicItem{
      height: 224px;
      background-color: #fff;
      background-image: url("../assets/clinicLogo.png");
      background-repeat: no-repeat;
      background-position: 401px 21px;
      background-size: 250px 203px;
      padding: 32px;
      box-sizing: border-box;
      .clinic-name{
        color: #333;
        font-size: 40px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      .clinic-num{
        color: #ADB6BA;
        font-size: 24px;
        margin-bottom: 28px;
      }
      .clinic-info-box{
        display: flex;
        align-items: center;
        .clinic-info{
          display: flex;
          align-items: center;
          &:first-child{
            margin-right: 48px;
          }
          .clinic-info-logo{
            display: inline-block;
            width: 32px;
            height: 32px;
            background-size: 100% 100%;
            margin-right:4px;
          }
          .clinic-info-logo-user{
            background-image: url("../assets/clinic-user-logo.png");
          }
          .clinic-info-logo-phone{
            background-image: url("../assets/clinic-phone-logo.png");
          }
          .clinic-info-txt{
            color: #21AEC3;
            font-size: 32px;
          }
        }
      }
    }
</style>