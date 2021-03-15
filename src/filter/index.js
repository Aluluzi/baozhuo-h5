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

Vue.filter("orderStatus_name", function(status) {
  let val = '-'
  switch (status) {
    case 0:
      val = '已关闭'
      break;
    case 10:
      val = '待付款'
      break;
    case 20:
      val = '未审核'
      break;
    case 30:
      val = '审核拒绝'
      break;
    case 40:
      val = '报告未出'
      break;
    case 45:
      val = '部分报告已出'
      break;
    case 50:
      val = '订单取消'
      break;
    case 60:
      val = '报告已出'
      break;
    default:
      val = ' - '
      break;
  }
  return val;
});
Vue.filter("orderStatus_className", function(status) {
  let val = '-'
  switch (status) {
    case 0:
      val = 'order-status-qx'
      break;
    case 10:
      val = 'order-status-dfk'
      break;
    case 20:
      val = 'order-status-wsh'
      break;
    case 30:
      val = 'order-status-jj'
      break;
    case 40:
      val = 'order-status-bbwc'
      break;
    case 45:
      val = 'order-status-bbyc'
      break;
    case 50:
      val = 'order-status-qx'
      break;
    case 60:
      val = 'order-status-bgyc'
      break;
    default:
      val = 'order-status-qx'
      break;
  }
  return val;
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
