// 格式化金额
export const formatMoney = (val) => {
  //金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
  if (!val) return 0;
  let str = (val / 100).toFixed(2) + "";
  let intSum = str
    .substring(0, str.indexOf("."))
    .replace(/\B(?=(?:\d{3})+$)/g, ","); //取到整数部分
  let dot = str.substring(str.length, str.indexOf(".")); //取到小数部分搜索
  let ret = intSum + dot;
  return `${ret}`;
};

/**
 * 节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 **/
export const Throttle = (fn, t) => {
  let last;
  let timer;
  let interval = t || 500;
  return function() {
    let args = arguments;
    let now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(this, args);
      }, interval);
    } else {
      last = now;
      fn.apply(this, args);
    }
  };
};

/**
 * 防抖
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
// export const Debounce = (fn, t) => {
// 	let delay = t || 500;
// 	let timer;
// 	return function () {
// 		let args = arguments;
// 		if (timer) {
// 			clearTimeout(timer);
// 		}
// 		timer = setTimeout(() => {
// 			timer = null;
// 			fn.apply(this, args);
// 		}, delay);
// 	}
// };
export const Debounce = (func, wait, immediate) => {
  let timeout;

  return function() {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
  };
};
//验证手机号
export const isPoneAvailable = (val) => {
  let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(val)) {
    return false;
  } else {
    return true;
  }
};
//验证身份证号码
export const isIdCardAvailable = (val) => {
  let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  if (!reg.test(val)) {
    return false;
  } else {
    return true;
  }
};
//时间戳转年月日
export const timestampToTime = (timestamp) => {
  let times = timestamp.length === 10 ? timestamp * 1000 : timestamp;
  var date = new Date(times); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  // var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  // var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  // var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D;
};

// 数字大写（因为处方不会超过10个先写个简单的）
export const capitalNum = (num) => {
  const arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  return num && arr[num - 1];
};

// 设置标题
export const setDocumentTitle = (title) => {
  title = title || " ";
  document.title = title;
  if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
    let iframe = document.createElement("iframe");
    iframe.src = "/MP_verify_zxjwxCcP80t475ww.txt";
    iframe.style.display = "none";
    iframe.onload = function() {
      setTimeout(function() {
        iframe.remove();
      }, 0);
      document.body.appendChild(iframe);
    };
  }
};

// 反序列化
export const serializeUrl = (str) => {
  var param = {},
    hash = {},
    anchor;
  var url = str || location.href;
  var arr = /([^?]*)([^#]*)(.*)/.exec(url);
  var ar1 = /(.*:)?(?:\/?\/?)([\.\w]*)(:\d*)?(.*?)([^\/]*)$/.exec(arr[1]);
  var ar2 = arr[2].match(/[^?&=]*=[^?&=]*/g);
  var ar3 = arr[3].match(/[^#&=]*=[^#&=]*/g);

  if (ar2) {
    for (var i = 0, l = ar2.length; i < l; i++) {
      var ar22 = /([^=]*)(?:=*)(.*)/.exec(ar2[i]);
      param[ar22[1]] = ar22[2];
    }
  }

  if (ar3) {
    for (var i = 0, l = ar3.length; i < l; i++) {
      var ar33 = /([^=]*)(?:=*)(.*)/.exec(ar3[i]);
      hash[ar33[1]] = ar33[2];
    }
  }

  if (arr[3] && !/[=&]/g.test(arr[3])) {
    anchor = arr[3];
  }

  function getUrl() {
    var that = this,
      url = [],
      param = [],
      hash = [];

    url.push(
      that.protocol,
      (that.protocol && "//") || " ",
      that.host,
      that.port,
      that.path,
      that.file
    );

    for (var p in that.param) {
      param.push(p + "=" + that.param[p]);
    }

    for (var p in that.hash) {
      hash.push(p + "=" + that.hash[p]);
    }

    url.push((param.length && "?" + param.join("&")) || " ");

    if (that.anchor) {
      url.push(that.anchor);
    } else {
      url.push((hash.length && "#" + hash.join("&")) || "");
    }

    return url.join(" ");
  }

  return {
    href: arr[0],
    protocol: ar1[1],
    host: ar1[2],
    port: ar1[3] || " ",
    path: ar1[4],
    file: ar1[5],
    param: param,
    hash: hash,
    anchor: anchor,
    getUrl: getUrl,
  };
};

//判断是否在微信中
export const is_weixin = () => {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
};

// 获取url参数集合
export const GetRequest = (urlStr) => {
  if (typeof urlStr == "undefined") {
    var url = decodeURI(location.search); //获取url中"?"符后的字符串
  } else {
    var url = "?" + urlStr.split("?")[1];
  }
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    let strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return theRequest;
};

// 去除对象里的undefined，null
export const dataType = (obj) => {
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  return Object.prototype.toString.call(obj).slice(8, -1);
};

export const dealObjectValue = (obj) => {
  var param = {};
  if (obj === null || obj === undefined || obj === "") return param;
  for (var key in obj) {
    // 判断是否是Object对象
    if (dataType(obj[key]) === "Object") {
      param[key] = dealObjectValue(obj[key]);
    } else if (
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== "undefined" &&
      obj[key] !== ""
    ) {
      param[key] = obj[key];
    }
  }
  return param;
};

//去除url中指定参数
export const delParam = (paramKey, href) => {
  var url = href; //页面url
  var urlParam = url.substr(url.indexOf("?") + 1); //页面参数
  var beforeUrl = url.substr(0, url.indexOf("?")); //页面主地址（参数之前地址）
  var nextUrl = "";
  var arr = new Array();
  if (urlParam != "") {
    var urlParamArr = urlParam.split("&"); //将参数按照&符分成数组
    for (var i = 0; i < urlParamArr.length; i++) {
      var paramArr = urlParamArr[i].split("="); //将参数键，值拆开
      //如果键雨要删除的不一致，则加入到参数中
      if (paramArr[0] != paramKey) {
        arr.push(urlParamArr[i]);
      }
    }
  }
  if (arr.length > 0) {
    nextUrl = "?" + arr.join("&");
  }
  url = beforeUrl + nextUrl;
  return url;
};

// 判断浏览器内核版本
// export const MobilType = () => {
//     //判断数组中是否包含某字符串
//     Array.prototype.contains = function (needle) {
//         for ( i in this ) {
//             if ( this[i].indexOf(needle) > 0 )
//                 return i;
//         }
//         return -1;
//     }
//
//     var device_type = navigator.userAgent; //获取userAgent信息
//     var md = new MobileDetect(device_type); //初始化mobile-detect
//     var os = md.os(); //获取系统
//     var model = "";
//     if ( os == "iOS" ) { //ios系统的处理
//         os = +md.version("iPhone");
//         model = md.mobile();
//     } else if ( os == "AndroidOS" ) { //Android系统的处理
//         os = md.os() + md.version("Android");
//         var sss = device_type.split(";");
//         var i = sss.contains("Build/");
//         if ( i > -1 ) {
//             model = sss[i].substring(0, sss[i].indexOf("Build/"));
//         }
//     }
//     return { os, model };
// }

//订单状态
export const orderStatus = (
  sample_delivery_status,
  refund_status,
  is_report
) => {
  if (refund_status != 0) {
    // 退款状态0无退款1部分退款2全部退款
    if (refund_status == 1) {
      return {
        title: "部分退款",
        slogn: "",
      };
    }
    if (refund_status == 2) {
      return {
        title: "已退款",
        slogn: "",
      };
    }
  } else {
    // 0标本未寄出1标本已寄出
    if (sample_delivery_status == 0) {
      return {
        title: "样本待邮寄",
        slogn: "请尽快寄出样本~",
      };
    }
    switch (is_report) {
      case 0:
        return {
          title: "报告未出",
          slogn: "报告正在加急处理，请耐心等待～",
        };
      case 1:
        return {
          title: "报告已出",
          slogn: "检验报告已生成，可随时查看详情~",
        };
      default:
        return {
          title: "报告部分已出",
          slogn: "其余报告正在加急处理，请耐心等待～",
        };
    }
  }
};

// 补零
export const FillZero = (num, len) => num.toString().padStart(len, "0");
// 时间格式化
export const getFormatDate = (date, dateType, separator = "-") => {
  let dateObj = new Date(date);
  let year = dateObj.getFullYear();
  let month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  let day = dateObj
    .getDate()
    .toString()
    .padStart(2, "0");
  let hours = dateObj
    .getHours()
    .toString()
    .padStart(2, "0");
  let minutes = dateObj
    .getMinutes()
    .toString()
    .padStart(2, "0");
  let seconds = dateObj
    .getSeconds()
    .toString()
    .padStart(2, "0");

  let dateText = "";
  if (dateType) {
    switch (dateType) {
      case "ymd":
        dateText = "" + year + separator + month + separator + day;
        break;
      case "ym":
        dateText = "" + year + separator + month;
        break;
      case "md":
        dateText = month + separator + day;
        break;
      case "ymdhm":
        dateText =
            year +
            separator +
            month +
            separator +
            day +
            " " +
            hours +
            ":" +
            minutes;
        break;
      case "ymdhms":
        dateText =
          year +
          separator +
          month +
          separator +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        break;
      case "mdhms":
        dateText =
          month + separator + day + " " + hours + ":" + minutes + ":" + seconds;
        break;
      case "yyyy年mm月dd日 MM:mm:ss":
        dateText =
          year +
          "年" +
          month +
          "月" +
          day +
          "日" +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        break;
      default:
        dateText = year + "年" + month + "月" + day + "日";
    }
    return dateText;
  } else {
    let timeobj = {
      year: year,
      month: month,
      day: day,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
    return timeobj;
  }
};

/**
 * 日期取前，取后
 *
 * @param year 必传
 * @param month 必传
 * @param day 日期 必传，无值的情况传null或''
 * @param separator  连接符 必传，无值的情况传null或''，默认为年月日，例：2020年01月01日，或2020-01-01
 *
 * return{
 *     year, 2020
 *     month, 1
 *     day, 1
 *     date, 2020-1-1
 *     FillZeroDate 月日小于10时，会自动补零；2020-01-01
 * }
 * */
export const getPreDate = (year, month, day = -1, separator = "") => {
  year = Number(year);
  month = Number(month);
  day = day > 0 ? Number(day) : null;

  const bigMon = [1, 3, 5, 7, 8, 10, 12];
  const smallMon = [4, 6, 9, 11];
  let date = "";
  let FillZeroDate = "";

  if (day) {
    if (day == 1) {
      if (month == 1) {
        year = year - 1;
        month = 12;
        day = 31;
      } else {
        let newMonth = month - 1;
        month = newMonth;
        if (bigMon.includes(newMonth)) {
          day = 31;
        } else if (smallMon.includes(newMonth)) {
          day = 30;
        } else {
          if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            day = 29;
          } else {
            day = 28;
          }
        }
      }
    } else {
      day = day - 1;
    }
    date =
      year +
      (separator || "年") +
      month +
      (separator || "月") +
      day +
      (separator ? "" : "日");
    FillZeroDate =
      year +
      (separator || "年") +
      month.toString().padStart(2, "0") +
      (separator || "月") +
      day.toString().padStart(2, "0") +
      (separator ? "" : "日");
  } else {
    if (month == 1) {
      year = year - 1;
      month = 12;
    } else {
      month = month - 1;
    }
    date = year + (separator || "年") + month + (separator ? "" : "月");
    FillZeroDate =
      year +
      (separator || "年") +
      month.toString().padStart(2, "0") +
      (separator ? "" : "月");
  }

  return { year, month, day, date, FillZeroDate };
};
export const getNextDate = (year, month, day = -1, separator = "") => {
  year = Number(year);
  month = Number(month);
  day = day > 0 ? Number(day) : "";

  const bigMon = [1, 3, 5, 7, 8, 10, 12];
  const smallMon = [4, 6, 9, 11];
  const dateObj = new Date();
  const currentYear = dateObj.getFullYear();
  const currentMonth = dateObj.getMonth() + 1;
  const currentDay = dateObj.getDate();

  let date = "";
  let FillZeroDate = "";

  if (day) {
    if (year >= currentYear && month >= currentMonth && day >= currentDay) {
      console.log("不能选择未来日期");
      return false;
    }
    if (bigMon.includes(month)) {
      if (day == 31) {
        if (month == 12) {
          year = year + 1;
          month = 1;
          day = 1;
        } else {
          month = month + 1;
          day = 1;
        }
      } else {
        day = day + 1;
      }
    } else if (smallMon.includes(month)) {
      if (day == 30) {
        month = month + 1;
        day = 1;
      } else {
        day = day + 1;
      }
    } else {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        if (day == 29) {
          month = month + 1;
          day = 1;
        } else {
          day = day + 1;
        }
      } else {
        if (day == 28) {
          month = month + 1;
          day = 1;
        } else {
          day = day + 1;
        }
      }
    }

    date =
      year +
      (separator || "年") +
      month +
      (separator || "月") +
      day +
      (separator ? "" : "日");
    FillZeroDate =
      year +
      (separator || "年") +
      month.toString().padStart(2, "0") +
      (separator || "月") +
      day.toString().padStart(2, "0") +
      (separator ? "" : "日");
  } else {
    if (year >= currentYear && month >= currentMonth) {
      console.log("不能选择未来日期");
      return false;
    }
    if (month == 12) {
      year = year + 1;
      month = 1;
    } else {
      month = month + 1;
    }

    date = year + (separator || "年") + month + (separator ? "" : "月");
    FillZeroDate =
      year +
      (separator || "年") +
      month.toString().padStart(2, "0") +
      (separator ? "" : "月");
  }

  return { year, month, day, date, FillZeroDate };
};

/**
 *   数组扁平
 *   const arr = [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]];
 *   Flat(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 * */
const Flat = (arr = []) => arr.reduce((t, v) => t.concat(Array.isArray(v) ? Flat(v) : v), [])