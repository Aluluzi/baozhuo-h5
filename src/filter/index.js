import Vue from "vue";
//数字大写（因为处方不会超过10个先写个简单的）
Vue.filter("capitalNum", function(num) {
  const arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  return arr[num];
});
//金额格式化
Vue.filter("formatMoney", function(val) {
  //金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
  if (!val) return 0;
  val = Number(val); //如果进入的不是数字，将其转换为文字
  let str = val.toFixed(2) + "";
  let intSum = str
    .substring(0, str.indexOf("."))
    .replace(/\B(?=(?:\d{3})+$)/g, ","); //取到整数部分
  let dot = str.substring(str.length, str.indexOf(".")); //取到小数部分搜索
  let ret = intSum + dot;
  return `${ret}`;
});

Vue.filter("formatMoblie", function(val) {
  if (!val) return "-";
  let s = val.substring(3, 7);
  val = val.replace(s, "****");
  return val;
});

Vue.filter("userStatus", function(status) {
  let txt = "";
  switch (status) {
    case -1:
      txt = "已禁用";
      break;
    case 0:
      txt = "用户未注册";
      break;
    case 1:
      txt = "审核中";
      break;
    case 2:
      txt = "审核已通过";
      break;
    case 3:
      txt = "审核未通过";
      break;
    default:
      txt = "用户未注册";
      break;
  }
  return txt;
});
Vue.filter("sexStatus", function(val) {
  switch (val) {
    case 1:
      return "男";
    case 2:
      return "女";
    default:
      break;
  }
});
