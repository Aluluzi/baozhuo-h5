import { GET, POST } from "@/utils/request";

export const login = (data) => POST("/api/login", data); //登录
// export const getLabList = (data) => POST("/api/lab/list", data); //实验室列表
export const getLabList = (data) => POST("/api/lab/all", data); //实验室列表(全部)
export const getCategoryList = (data) => POST("/api/category/list", data); //类目列表
export const getFavoriteList = (data) => POST("/api/favorite-item/list", data); //收藏项目列表
export const addFavoriteItem = (data) => POST("/api/favorite-item/add", data); //添加收藏
export const cancelFavoriteItem = (data) => POST("/api/favorite-item/cancel", data); //添加收藏
export const getInspectionItemList = (data) => POST("/api/inspection-item/list", data); //检验项目列表
export const addTrade = (data) => POST("/api/trade/add", data); //下单
export const tradeList = (data) => POST("/api/trade/list", data); //订单列表
export const getPayParam = (data) => POST("/api/trade/pay-param", data); //获取单独支付订单参数
// export const tradeDetail = (data) => POST("/api/trade",data); //订单列表
export const tradeCancel = (data) => POST("/api/trade/cancel",data); //订单取消
export const getClinicList = (data) => POST("/api/clinic/list",data); //诊所列表

export const getSalesmanTrade = (data) => POST("/api/trade/salesman-trades",data); //查询业务员待审核的医生订单列表
export const tradeExamine = (data) => POST("/api/trade/auth",data); //业务员审核订单


export const weChatGetTicked = (data) => POST("/wechat/js-ticked",data); //获取微信Ticked
export const weChatSendCode = (data) => POST("/api/user/auth-code",data); //提交code获取openid
