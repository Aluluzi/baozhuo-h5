<template>
    <div class="boxs">
      <div class="logobox"></div>

      <div class="main">
        <div class="box">
          <i class="logo-user"></i>
          <input type="text" placeholder="请输入账号" v-model="username">
        </div>
        <div class="box">
          <i class="logo-pwd"></i>
          <input type="password" placeholder="请输入密码" v-model="password">
        </div>
      </div>

      <div class="btn-box">
        <Footbtn text="登录" @click_btn="login" :disabled="btn_suo" />
      </div>
    </div>
</template>

<script>
import Footbtn from "@/components/Footbtn.vue";
import {login} from '@/api/index'
import store from "@/store";
export default {
name: "login",
  components: { Footbtn },
  data(){
    return {
      btn_suo:false,
      username:'',
      password:'',
    }
  },
  methods:{
    login(){
      login({
        username:this.username,
        password:this.password
      }).then(res=>{
        if(res){
          store.dispatch("saveToken", {
            ...res,
          });
          localStorage.setItem("loginInfo", JSON.stringify(res));

          console.log(!res.wechatAuth)
          if(!res.wechatAuth){
            this.$router.replace('/authorize')
          }else{
            this.$router.replace('/tabbar/user')
          }

        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .boxs{
    background: #fff;
    height: 100vh;
  }
  .logobox{
    height: 547px;
    width: 100%;
    //background: #21AEC3;
    background: url("../assets/loginLogo.png") no-repeat;
    background-size: 100% 100%;
  }
  .main{
    padding: 0 64px;
    margin: 48px 0;
    >:last-child{
      margin-top: 24px;
    }
    .box{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #EBEBEB;
      height: 88px;
      >i{
        width: 32px;
        height: 32px;
        margin-right: 15px;
        background-size: 100% 100%;
      }
      >input{
        display: inline-block;
        height: 32px;
        width: 100%;
        color: #333;
        border: none;
        font-size: 32px;
      }

      .logo-user{
        background-image: url("../assets/login-user.png");
      }
      .logo-pwd{
        background-image: url("../assets/login-pwd.png");
      }
    }
  }

  .btn-box{
    padding: 0 64px;
  }


  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #9D9D9D;
    font-size: 32px;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #9D9D9D;
    font-size: 32px;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #9D9D9D;
    font-size: 32px;
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #9D9D9D;
    font-size: 32px;
  }


</style>