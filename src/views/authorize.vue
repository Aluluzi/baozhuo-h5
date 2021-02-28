<template>
    <div class='authorize'>
        <van-loading type="spinner" color="#1989fa" />
        <p v-if="!isWX">请在微信浏览器打开</p>
    </div>
</template>

<script>
    import {weChatGetTicked, weChatSendCode} from "../api/index";
    import wx from "weixin-js-sdk";
    import {serializeUrl} from '@/utils/utils'
    import {mapState} from "vuex";
    import store from "@/store";

    export default {
        name: "authorize",
        components: {},
        data() {
            return {
                isWX: true
            };
        },
        computed: {
          ...mapState({
            tokenInfo: "tokenInfo",
          }),
        },
        created() {
            let ua = window.navigator.userAgent.toLowerCase()
            if (ua.indexOf('micromessenger') === -1) {
                // 不是微信环境
                console.log('不是微信环境')
                this.isWX = false
                return
            }

          let code = serializeUrl().param.code
          if(!code){
            this.authorize()
          }else{
            this.getCode(code)
          }

        },
        mounted() {
        },
        destroy() {
        },
        methods: {
          authorize(){
            const redirect_uri = window.location.href.split('#')[0]
            weChatGetTicked({
              url:redirect_uri
            }).then(res => {
              wx.config({
                debug: false,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: `${res.noncestr}`,
                signature: res.signature,
                jsApiList: ['chooseWXPay']
              })
              const appId = res.appId
              wx.ready((res) => {
                let url = encodeURIComponent(redirect_uri)
                let urls = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appId+'&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                window.location = urls
              })
            })
          },
          getCode(code){
            weChatSendCode({
              code:code
            }).then(res=>{
              if(res){
                const info = {...this.tokenInfo}
                info.wechatAuth = true
                this.$store.dispatch("saveToken", {});
                localStorage.removeItem('loginInfo');

                localStorage.setItem("loginInfo", JSON.stringify(info));
                //存储登录信息
                this.$store.dispatch("saveToken", {
                  ...info,
                });

                this.$router.push('/')
              }
            })
          },
            login(){
                const redirect_uri = window.location.href.split('#')[0]
              weChatGetTicked({
                url:redirect_uri
              }).then(res => {
                    wx.config({
                        debug: false,
                        appId: res.appId,
                        timestamp: res.timestamp,
                        nonceStr: `${res.noncestr}`,
                        signature: res.signature,
                        jsApiList: []
                    })
                    const appId = res.appId
                    wx.ready((res) => {
                        let url = encodeURIComponent(redirect_uri)
                        let urls = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appId+'&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                        let code = serializeUrl().param.code
                        if(!code){
                            window.location = urls
                        }else{
                          console.log(code)
                          weChatSendCode({
                            code:code
                          }).then(res=>{
                            console.log(res)
                            if(res.data.data){
                              console.log('调用成功')
                              const info = {...this.tokenInfo}
                              info.wechatAuth = true
                              this.$store.dispatch("saveToken", {
                                ...info,
                              });
                              this.$router.push('/')
                            }else{
                              console.log('调用失败')
                            }
                          })

                        }
                    })
                })
            }
        }
    };
</script>

<style scoped lang="scss">
    .authorize{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgb(251, 251, 251);
        font-size: 32px;
        text-align: center;
        color: #999;
    }
    .logo{
        display: block;
        margin: 0 auto;
        padding-top: 70%;
        width: 50%;
    }
</style>
