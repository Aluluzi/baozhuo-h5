import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import {GetRequest} from "@/utils/utils.js";

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/tabbar/user", //重定向
        },
        {
            path: "/login",
            name: "login",
            meta: {
                title: "登录",
                index: 0,
                keep_alive: true,
            },
            component: () => import("@/views/login.vue"),
        },
        {
            path: "/tabbar",
            name: "tabbar",
            component: () => import("@/views/tabbar.vue"),
            children: [
                {
                    path: "getOrder",
                    name: "getOrder",
                    meta: {
                        title: "我要下单", //商城
                        index: 0,
                        keep_alive: true,
                        isCanReturn: true,
                    },
                    component: () => import("@/views/tab/getOrder.vue"),
                },
                {
                    path: "examine",
                    name: "examine",
                    meta: {
                        title: "审核",
                        index: 0,
                        keep_alive: true,
                        isCanReturn: true,
                    },
                    component: () => import("@/views/tab/examine.vue"),
                },
                {
                    path: "user",
                    name: "user",
                    meta: {
                        title: "个人中心",
                        index: 0,
                        keep_alive: true,
                    },
                    component: () => import("@/views/tab/user.vue"),
                },
            ],
        },
        {
            path: "/editCode",
            name: "editCode",
            meta: {
                title: "录入条码",
                index: 4,
                keep_alive: true,
            },
            component: () => import("@/views/editCode.vue"),
        },
        {
            path: "/editInfo",
            name: "editInfo",
            meta: {
                title: "录入信息",
                index: 5,
                keep_alive: true,
            },
            component: () => import("@/views/editInfo.vue"),
        },
        {
            path: "/checkOrderInfo",
            name: "checkOrderInfo",
            meta: {
                title: "预览信息",
                index: 6,
                keep_alive: true,
            },
            component: () => import("@/views/checkOrderInfo.vue"),
        },
        {
            path: "/pay",
            name: "pay",
            meta: {
                title: "支付",
                index: 7,
                keep_alive: true,
            },
            component: () => import("@/views/pay.vue"),
        },
        {
            path: "/clinicList",
            name: "clinicList",
            meta: {
                title: "我的客户",
                index: 1,
                keep_alive: true,
            },
            component: () => import("@/views/clinicList.vue"),
        },
        {
            path: '/order',
            name: 'order',
            meta: {
                title: '全部订单',
                index: 1,
                keep_alive: true
            },
            component: () => import('@/views/order.vue')
        },
        {
            path: "/orderDetail",
            name: "orderDetail",
            meta: {
                title: "订单详情",
                index: 2,
            },
            component: () => import("@/views/orderDetail.vue"),
        },
        {
            path: "/authorize",
            name: "authorize",
            meta: {
                title: "微信登录",
                index: 0,
            },
            component: () => import("@/views/authorize.vue"),
        },
        {
            path: "/EinvoiceDetail",
            name: "EinvoiceDetail",
            meta: {
                title: "查看报告",
                index: 4,
            },
            component: () => import("@/views/EinvoiceDetail.vue"),
        },
        {
            path: "/salesOrderList",
            name: "salesOrderList",
            meta: {
                title: "审核列表",
                index: 2,
                // keep_alive: true,
            },
            component: () => import("@/views/salesOrderList.vue"),
        },{
            path: "/salesOrderDetail",
            name: "salesOrderDetail",
            meta: {
                title: "订单详情",
                index: 3,
                keep_alive: true,
            },
            component: () => import("@/views/salesOrderDetail.vue"),
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.meta.isScroll) {
            return {x: 0, y: 0};
        }
    },
});

router.beforeEach(async (to, from, next) => {

    if (store.getters.noToken) {
        //读取缓存信息
        let loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
        //roleType
        // 1-后台管理员帐号、
        // 2-业务员帐号
        // 3-诊所管理帐号
        // 4-医生帐号
        if (loginInfo && loginInfo.token && loginInfo.roleType) {
            localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
            //存储登录信息
            store.dispatch("saveToken", {
                ...loginInfo,
            });
            if(!loginInfo.wechatAuth){
                if(to.path!=='/authorize'){
                    next('/authorize')
                    return
                }
            }
            if(to.path == '/login' || to.path == '/authorize'){
                next('/tabbar/user')
                return
            }
        } else {
            if(to.path!=='/login'){
                next('/login')
                return
            }
            //没有缓存信息
            // let {code} = GetRequest(window.location.href); // 截取url上的code ,可能没有,则返回''空字符串
            // if (code) {
                // let authInfo = await authorize.auth({
                //     official_account: 1,
                //     code,
                //     state,
                // }); // 获取用户信息,后端可首先通过cookie,session等判断,没有信息则通过code获取
                // // console.log(authInfo);
                // // 返回用户信息
                // if (authInfo.data.code === 0) {
                //     let {openid} = authInfo.data.data;
                //     let loginInfo = await authorize.login({
                //         official_account: 1,
                //         openid,
                //     }); // 获取用户登录信息
                //     // console.log(loginInfo);
                //     if (loginInfo.data.code === 0) {
                //         //存储登录信息
                //         store.dispatch("saveToken", {
                //             partner_code,
                //             ...loginInfo.data.data,
                //         });
                //         sessionStorage.setItem("partner_code", partner_code);
                //         localStorage.setItem(
                //             "loginInfo",
                //             JSON.stringify(loginInfo.data.data)
                //         );
                //     }
                // }
            // } else {

                // 上面的获取用户信息接口,如果cookie,session拿不到用户信息,且传递的code为空,则跳转到微信授权页面
                // console.log(window.location.origin)
                // console.log(to.fullPath)
                // 这个redirectUrl用 当前页路径或者tof.fullPath(将要进入的路径)

                // let redirectUrl =
                //   window.location.origin + "/mjkb-partner/index.html#" + to.fullPath;
                // redirectUrl = encodeURIComponent(redirectUrl);
                // //console.log(redirectUrl)
                // window.location.replace(
                //   `${baseURL}/site/wechat/redirect?official_account=1&redirect_url=${redirectUrl}`
                // );
            // }
        }
    }else{
        let loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
        if(!loginInfo.wechatAuth){
            if(to.path!=='/authorize'){
                next('/authorize')
                return
            }
        }
    }
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    // console.log(to.query)
    // console.log(from.query)
    // if (!to.query.roleType && from.query.roleType) {
    //     let newTo = { ...to }
    //     const type = from.query.roleType;
    //     newTo.query = { ...to.query, type }
    //     // next({ ...newTo, replace: true })
    //     next({path:to.path, query:to.query, replace: false});
    //     console.log(newTo.query)
    //     return;
    //
    //     // return
    // }
    // if (!from.query.roleType) {
    //     let newTo = { ...to }
    //     const type = from.query.roleType;
    //     newTo.query = { ...to.query, type }
    //     next({ ...newTo, replace: true })
    //     return
    // }

    next();
});

//http,某些网络下手机加载js资源失败
router.onError((error) => {
    console.log(error)
    //需要replace的路由
    const replace_list = ["PayMethod", "PaySuccess", "ApplyforReturn"];
    const pattern = /chunk-/g;
    const isChunkLoadFailed = error.request.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (error.type === "missing" && isChunkLoadFailed) {
        replace_list.includes(router.history.pending.name)
            ? router.replace(targetPath)
            : router.push(targetPath);
    }
});
export default router;
