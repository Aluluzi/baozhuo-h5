<template>
  <div class="orderConfirm">
    <test-item
      :id="itemId"
      :image="itemImage"
      :name="itemName"
      :newPrice="itemNewPrice"
      :oldPrice="itemOldPrice"
      type="other"
    ></test-item>
    <!--填写-->
    <div v-if="!isCan_balance_pay">
      <div class="edit-info-box">
        <div class="edit-info-box-2">
          <scan
            @getBarcode="getBarcode"
            label="条码号"
            placeholder="请输入条码号"
          ></scan>
          <van-field
            :value="name"
            label="受检人姓名"
            placeholder="请选择受检人"
            readonly
            is-link
            @click="$router.push('selectBpeople')"
          />
          <!-- <van-field label="受检人姓名" placeholder="请输入受检人姓名" v-model="name" />-->
          <!-- <picker-sex @chooseSex="chooseSex" class="pickerList"></picker-sex> -->
          <van-field
            :value="sex | sexStatus"
            label="受检人性别"
            placeholder
            type="digit"
            readonly
          />
          <van-field
            :value="age"
            label="受检人年龄"
            placeholder
            type="digit"
            readonly
          />
          <van-field
            :value="phone"
            center
            clearable
            label="受检人手机"
            placeholder
            readonly
          />
        </div>
        <div class="edit-info-box-2">
          <van-field
            :value="consignee_name"
            label="收件人姓名"
            placeholder="请选择收件人"
            readonly
            is-link
            @click="$router.push('selectAddress')"
          />
          <!-- <van-field label="收件人姓名" placeholder="请输入收件人姓名" v-model="consignee_name" />-->
          <van-field
            :value="consignee_mobile"
            center
            clearable
            label="收件人电话"
            placeholder
            readonly
          />
          <!-- <picker-address @itemSelect="getAddressId(arguments)"></picker-address> -->
          <van-field :value="region" label="省市区" placeholder readonly />
          <van-field :value="address" label="详细地址" placeholder readonly />
          <!-- <picker-list :data="pickerDeliveryData" @choosePicker="chooseDelivery" class="pickerList"></picker-list>
          <van-field label="物流单号" placeholder="请输入物流单号" v-model="sample_delivery_order_number" />-->
        </div>
        <div>
          <van-field label="申请单上传" name="apply_file">
            <template #input>
              <van-uploader
                :after-read="uploadFile"
                :before-delete="deleteFile"
                :capture="capture"
                :max-count="1"
                :max-size="5 * 1024 * 1024"
                :preview-image="true"
                @oversize="onOversize"
                accept="image/*"
                v-model="apply_file"
              />
            </template>
          </van-field>
        </div>
      </div>
      <Footbtn :disabled="isClick" :text="btnTitle" @click_btn="buy"></Footbtn>
      <van-action-sheet v-model="show" title="选择支付方式">
        <div class="popup-content">
          <van-cell-group>
            <van-cell title="自己支付" is-link @click="selectPay(1)" />
            <van-cell title="患者支付" is-link @click="selectPay(2)" />
          </van-cell-group>
        </div>
      </van-action-sheet>
    </div>
    <div class="wallet-pay" v-else>
      <div class="wallet-box" @click="isChooseWalletPay = !isChooseWalletPay">
        <div class="wallet-logo"></div>
        <div>
          <p class="wallet-title">钱包余额</p>
          <p class="wallet-num">￥{{ available_amount | formatMoney }}</p>
        </div>
        <div
          class="choose-wallet-logo"
          :class="isChooseWalletPay ? 'active' : ''"
        ></div>
      </div>
      <div class="wallet-pay-btn-box">
        <div class="wallet-pay-btn-box2" v-if="tokenInfo.show_real_price">
          <div class="wallet-pay-price">
            <p class="wallet-pay-allPrice">
              总计：
              <span>￥{{ itemNewPrice | formatMoney }}</span>
            </p>
            <p class="wallet-pay-walletPrice" v-if="isChooseWalletPay">
              钱包余额：
              <span>-￥{{ canUse_amount | formatMoney }}</span>
            </p>
          </div>
          <div class="wallet-pay-btn" @click="pay">
            立即支付 ￥{{ needPay_amount }}
          </div>
        </div>
        <div class="wallet-pay-btn-box2" v-else>
          <div class="wallet-pay-price">
            <p class="wallet-pay-allPrice">
              总计：
              <span>￥{{ itemOldPrice | formatMoney }}</span>
            </p>
            <p class="wallet-pay-walletPrice" v-if="isChooseWalletPay">
              钱包余额：
              <span>-￥{{ old_canUse_amount | formatMoney }}</span>
            </p>
          </div>
          <div class="wallet-pay-btn" @click="pay">
            立即支付 ￥{{ old_needPay_amount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TestItem from "../components/testList/TestItem";
import Footbtn from "../components/Footbtn";
import PickerAddress from "../components/from/PickerAddress";
import PickerSex from "../components/from/PickerSex";
// import PickerList from "../components/from/PickerList";
import scan from "../components/from/scan";
import api from "@/api/index";
import wx from "weixin-js-sdk";
import { isPoneAvailable, Debounce } from "@/utils/utils.js";
import Vue from "vue";
import axios from "axios";
Vue.prototype.$http = axios;
import { baseURL } from "@/config";
let uploadurl = "/site/upload-file";

import { mapState } from "vuex";

export default {
  name: "orderConfirm",
  components: {
    TestItem,
    Footbtn,
    PickerAddress,
    PickerSex,
    // PickerList,
    scan,
  },
  data() {
    return {
      name: "",
      sex: "",
      age: "",
      phone: "",
      province_code: null, //省市区
      city_code: null,
      area_code: null,
      region: "",
      address: "",
      sample_delivery_company_list: [], //物流公司列表
      showPicker: false,
      sample_delivery_company_id: "", //物流id
      sample_delivery_order_number: "", //物流单号
      apply_file_url: "", //申请单
      apply_file: [],
      capture: false,
      barcode: "", //条码号
      //   pickerDeliveryData: {
      //     label: "物流公司",
      //     placeholder: "请选择物流公司",
      //     list: []
      //   },
      consignee_name: "",
      consignee_mobile: "",
      btnTitle: "立即支付",
      itemId: null,
      itemImage: "",
      itemName: "",
      itemNewPrice: 0,
      itemOldPrice: 0,
      isCan_balance_pay: false,
      can_balance_pay: false, //是否可以使用钱包支付

      available_amount: 0, //可使用的钱包余额（可提现金额）
      isChooseWalletPay: false,
      // canUse_amount:0,//可使用的钱包余额
      // needPay_amount:0//需要支付的金额
      //支付弹框
      show: false,
    };
  },
  watch: {
    // apply_file:function(val){
    //     console.log(val)
    //     this.uploadFile(val[0].file)
    // }
  },
  computed: {
    ...mapState({
      tokenInfo: "tokenInfo",
    }),
    isClick: function () {
      if (
        this.name &&
        this.sex &&
        this.age &&
        this.phone &&
        this.province_code &&
        this.city_code &&
        this.area_code &&
        this.address &&
        // this.sample_delivery_company_id &&
        // this.sample_delivery_order_number &&
        this.apply_file_url &&
        this.barcode &&
        this.consignee_name &&
        this.consignee_mobile
      ) {
        return false;
      } else {
        return true;
      }
    },
    canUse_amount: function () {
      if (+this.available_amount >= +this.itemNewPrice) {
        return +this.itemNewPrice;
      } else {
        return +this.available_amount;
      }
    },
    needPay_amount: function () {
      if (this.isChooseWalletPay) {
        if (+this.available_amount >= +this.itemNewPrice) {
          return 0;
        } else {
          return (
            (parseInt(this.itemNewPrice * 100 + 0.5) -
              parseInt(this.available_amount * 100 + 0.5)) /
            100
          );
        }
      } else {
        return +this.itemNewPrice;
      }
    },
    old_canUse_amount: function () {
      if (+this.available_amount >= +this.itemOldPrice) {
        return +this.itemOldPrice;
      } else {
        return +this.available_amount;
      }
    },
    old_needPay_amount: function () {
      if (this.isChooseWalletPay) {
        if (+this.available_amount >= +this.itemOldPrice) {
          return 0;
        } else {
          return (
            (parseInt(this.itemOldPrice * 100 + 0.5) -
              parseInt(this.available_amount * 100 + 0.5)) /
            100
          );
        }
      } else {
        return +this.itemOldPrice;
      }
    },
  },
  created() {
    this.can_balance_pay =
      JSON.parse(localStorage.getItem("loginInfo")).can_balance_pay == 0
        ? false
        : true;
    if (this.$route.query.id) {
      let { id, image, name, newPrice, oldPrice, skus_id } = this.$route.query;
      this.itemId = id;
      this.itemImage = image;
      this.itemName = name;
      this.itemNewPrice = newPrice;
      this.itemOldPrice = oldPrice;
      this.item_id = skus_id;
    } else {
      this.$toast({ message: "页面加载错误，请稍后重试！" });
    }
    // this.getDeliveryCompanyList();
    // if ( MobilType().model.indexOf("PAAT00") > 0 ) {
    //     this.capture = "camera";
    // }
  },
  mounted() {},
  activated() {
    if (this.$store.state.addressInfo) {
      let {
        name,
        mobile,
        province_code,
        city_code,
        area_code,
        address,
        id,
        region,
      } = this.$store.state.addressInfo;
      this.consignee_name = name;
      this.consignee_mobile = mobile;
      this.province_code = province_code;
      this.city_code = city_code;
      this.area_code = area_code;
      this.region = region;
      this.address = address;
    }
    if (this.$store.state.BpeopleInfo) {
      let { name, mobile, sex, age, id } = this.$store.state.BpeopleInfo;
      this.name = name;
      this.age = age;
      this.sex = sex;
      this.phone = mobile;
    }
  },
  destroy() {},
  methods: {
    getAddressId(val) {
      this.province_code = val[0].array[0].id;
      this.city_code = val[0].array[1].id;
      this.area_code = val[0].array[2].id;
    },
    chooseSex(val) {
      this.sex = val;
    },
    chooseDelivery(val) {
      this.sample_delivery_company_id = val.id;
    },
    getBarcode(val) {
      this.barcode = val;
    },
    //将base64码转化为file
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: mime,
      });
    },
    uploadFile(val) {
      let files = val.file;
      val.status = "uploading";
      val.message = "上传中...";
      var param = new FormData(); // 创建form对象
      param.append("file", files, files.name); // 通过append向form对象添加数据
      param.append("token", this.$store.state.tokenInfo.token); // 添加form表单中其他数据
      param.append("salt", this.$store.state.tokenInfo.salt); // 添加form表单中其他数据
      let that = this;
      this.$http
        .post(baseURL + uploadurl, param)
        .then(function (res) {
          if (res.data.code == 0) {
            val.status = "done";
            val.message = "上传成功";
            that.apply_file_url = res.data.data.url;
          } else {
            val.status = "failed";
            val.message = "上传失败";
            // that.$toast(res.data.errorMsg);
          }
        })
        .catch(function (res) {
          val.status = "failed";
          val.message = "上传失败";
          // that.$toast("网络异常，请稍后重试！");
        });
    },
    onOversize(file) {
      this.$toast("图片不得大于5M");
    },
    deleteFile() {
      this.apply_file_url = "";
      this.apply_file = [];
    },
    // getDeliveryCompanyList() {
    //   api.getDeliveryCompanyList().then(res => {
    //     if (res.data.code == 0) {
    //       this.pickerDeliveryData.list = res.data.data;
    //     }
    //   });
    // },
    buy() {
      if (!isPoneAvailable(this.phone)) {
        this.$toast("受检人手机号码格式错误！");
        return;
      }
      if (!isPoneAvailable(this.consignee_mobile)) {
        this.$toast("收件人手机号码格式错误！");
        return;
      }
      this.show = true;
    },
    selectPay(payer_type) {
      //payer_type 1或不传表示自己支付，2表示病人支付
      if (payer_type == 2) {
        this.pay(payer_type);
        return;
      }
      if (this.can_balance_pay) {
        this.isCan_balance_pay = !this.isCan_balance_pay;
        api.user_account().then((res) => {
          if (res.data.code === 0) {
            this.available_amount = res.data.data.available_amount;
          }
        });
      } else {
        this.pay(1);
      }
    },
    pay: Debounce(function (payer_type) {
      const _this = this;
      let {
        item_id,
        name,
        age,
        sex,
        phone,
        address,
        province_code,
        city_code,
        area_code,
        barcode,
        apply_file_url,
        consignee_name,
        consignee_mobile,
        isChooseWalletPay,
      } = this;
      let params = {
        item_id,
        name,
        age,
        sex,
        mobile: phone,
        address,
        province_code,
        city_code,
        area_code,
        barcode,
        // sample_delivery_order_number: this.sample_delivery_order_number,
        // sample_delivery_company_id: this.sample_delivery_company_id,
        apply_file_url,
        consignee_name,
        consignee_mobile,
        use_balance_pay: isChooseWalletPay ? 1 : 0,
      };
      //样本耗材
      let { sample_consumable } = this.$route.query;
      sample_consumable = JSON.parse(sample_consumable);
      sample_consumable ? (params.sample_consumable = sample_consumable) : "";
      //患者支付
      payer_type == 2 ? (params.payer_type = payer_type) : "";
      // this.$toast('正在下单');
      api.buyItem(params).then((res) => {
        // _this.$toast.clear();
        if (res.data.code == 0) {
          let {
            params,
            order_id,
            order_price,
            use_balance_pay_success,
          } = res.data.data;

          if (payer_type == 2) {
            this.$router.replace({
              path: "/patientsPay",
              query: { ...params, order_id, order_price },
            });
            return;
          }

          if (use_balance_pay_success == 0) {
            wx.chooseWXPay({
              timestamp: params.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: params.nonce_str, // 支付签名随机串，不长于 32 位
              package: params.package_str, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: params.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: params.pay_sign, // 支付签名
              success: function () {
                _this.$router.replace({
                  path: "/paySuccess",
                  query: {
                    price: _this.itemNewPrice,
                    oldPrice: _this.itemOldPrice,
                    order_id,
                  },
                });
              },
            });
          } else {
            this.$router.replace({
              path: "/paySuccess",
              query: {
                price: this.itemNewPrice,
                oldPrice: _this.itemOldPrice,
                order_id,
              },
            });
          }
        }
      });
    }, 300),
  },
};
</script>

<style lang="scss" scoped>
.orderConfirm {
  background: #f5f5f5;
  .fillAddress {
    padding: 20px;
  }
  .popup-content {
    .van-cell__title {
      flex: 1;
    }
  }
}

.edit-info-box {
  /*margin-top: 20px;*/
  padding-bottom: 178px;

  .pickerList {
    padding-left: 30px;
    background: #fff;
  }
  .edit-info-box-2 {
    margin-top: 20px;
  }
}

.van-cell--clickable {
  .van-cell__title {
    flex: none;
    width: 182px;
  }

  .van-cell__value {
    text-align: left;
    font-size: 32px;
    color: #cccccc;
    letter-spacing: 0;
  }
}

.pickerAddress-box {
  background: #fff;
  padding-left: 37.5px;
}

.wallet-pay {
  .wallet-box {
    display: flex;
    align-items: center;
    height: 120px;
    background-color: #fff;
    margin-top: 20px;
    padding-left: 30px;
    position: relative;
    .wallet-logo {
      width: 52px;
      height: 52px;
      background-image: url("./../assets/wallet_logo.png");
      background-size: 100% 100%;
      margin-right: 30px;
    }
    .wallet-title {
      color: #333;
      font-size: 32px;
      line-height: 45px;
    }
    .wallet-num {
      color: #888;
      font-size: 24px;
      line-height: 33px;
      margin-top: 4px;
    }
    .choose-wallet-logo {
      width: 40px;
      height: 40px;
      background-image: url("./../assets/chooseWallet.png");
      background-size: 100% 100%;

      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
    .choose-wallet-logo.active {
      background-image: url("./../assets/choosedWallet.png");
    }
  }
  .wallet-pay-btn-box {
    background: #f5f5f5;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .wallet-pay-btn-box2 {
      display: flex;
      align-items: center;
      height: 108px;

      > div {
        flex: 1;
      }
      .wallet-pay-price {
        background-color: #fff;
        height: 100%;
        padding-left: 30px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        > p {
          color: #888;
          font-size: 24px;
          line-height: 33px;
        }
        .wallet-pay-allPrice {
          > span {
            color: #333;
          }
        }
        .wallet-pay-walletPrice {
          margin-top: 10px;
          > span {
            color: #ff0000;
          }
        }
      }
      .wallet-pay-btn {
        background-color: #7c5cf2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        color: #fff;
        font-size: 30px;
      }
    }
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    .wallet-pay-btn-box {
      background-color: #f5f5f5;
      .wallet-pay-btn-box2 {
        padding-bottom: 34px;
        border-radius: 10px;
      }
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    .wallet-pay-btn-box {
      background-color: #f5f5f5;
      .wallet-pay-btn-box2 {
        padding-bottom: 34px;
        border-radius: 10px;
      }
    }
  }
}
</style>
