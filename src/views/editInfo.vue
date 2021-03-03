<template>
  <div class="editInfo">
    <div class="edit-info-box">
      <van-field label="姓名" placeholder="请输入姓名" v-model="name"/>
      <van-field
          v-model="age"
          label="年龄"
          placeholder
          type="digit"
      />
      <van-field name="radio" label="性别">
        <template #input>
          <van-radio-group v-model="sex" direction="horizontal">
            <van-radio name="M">男
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon"/>
              </template>
            </van-radio>
            <van-radio name="F">女
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon"/>
              </template>
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
          v-model="phone"
          type="tel"
          :maxlength="11"
          center
          clearable
          label="手机号码"
          placeholder="请输入手机号码"
      />
      <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="time"
          label="采样时间"
          placeholder="请选择采样时间"
          is-link
          @click="showTimePicker = true"
      />
      <van-popup v-model="showTimePicker" position="bottom">
        <van-datetime-picker
            v-model="currentDate"
            type="datetime"
            title="请选择采样时间"
            @confirm="timeConfirm"
            @cancel="showTimePicker = false"
        />
      </van-popup>
      <van-field label="送检医生" placeholder="请输入送检医生姓名" :value="doctorName" readonly/>
    </div>
    <div class="btn-box">
      <Footbtn v-if="type==1" text="预览" @click_btn="buy" :disabled="isClick"/>
      <Footbtn v-else text="保存" @click_btn="save" :disabled="isClick"/>
    </div>
  </div>
</template>

<script>
import Footbtn from "@/components/Footbtn";
import activeIcon from '@/assets/btn-check-active.png'
import inactiveIcon from '@/assets/btn-check.png'

import {mapState} from "vuex";
import {isPoneAvailable, getFormatDate} from "@/utils/utils.js";

export default {
  name: "editInfo",
  components: {
    Footbtn,
  },
  data() {
    return {
      name: "",
      age: "",
      sex: "M",
      phone: "",
      time: "",
      currentDate: new Date(),
      showTimePicker: false,
      activeIcon: activeIcon,//选中图标
      inactiveIcon: inactiveIcon,//没选中图标
      doctorName: '',

      type: null,////1医生下单，2业务员编辑
      patient: {},////患者信息
      samplingTime: '',////采样时间
    };
  },
  watch: {},
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
          this.time
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    const {type} = this.$route.query
    const {patient, samplingTime, doctorName} = this.$route.params
    this.type = type
    this.patient = patient
    this.samplingTime = samplingTime

    if (type == 1) {
      this.doctorName = this.tokenInfo.name
    }
    if (type == 2) {
      this.doctorName = doctorName
      this.name = this.patient.name
      this.age = this.patient.age
      this.sex = this.patient.sex
      this.phone = this.patient.phone
      this.time = this.samplingTime
      this.currentDate = new Date(this.samplingTime)
    }
  },
  mounted() {
  },
  activated() {
    console.log(33)
  },
  destroy() {
  },
  methods: {
    buy() {
      if (!isPoneAvailable(this.phone)) {
        this.$toast("手机号码格式错误！");
        return;
      }
      if ( +this.age < 0 || +this.age >= 125) {
        this.$toast("年龄填写错误！");
        return;
      }
      const patientInfo = {
        name: this.name,
        phone: this.phone,
        age: this.age,
        sex: this.sex,
        samplingTime: this.time,
        docName: this.tokenInfo.name,
      }

      this.$store.dispatch("savePatientInfo", patientInfo);
      this.$router.push('/checkOrderInfo')
    },
    timeConfirm(time) {
      this.time = getFormatDate(time, 'ymdhms', '-');
      this.showTimePicker = false;
    },
    save() {
      this.patient.name = this.name;
      this.patient.age = +this.age;
      this.patient.sex = this.sex;
      this.patient.phone = this.phone;
      const info = {
        patient: {
          ...this.patient
        },
        samplingTime: getFormatDate(this.time, 'ymdhms', '-'),
      }
      this.$store.dispatch("saveEditPatientInfo", info);
      history.go(-1)
    }
  },
};
</script>

<style lang="scss" scoped>
.editInfo {
  background: #f5f5f5;
  position: relative;
  padding-top: 24px;

  .popup-content {
    .van-cell__title {
      flex: 1;
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

  .btn-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 32px 78px;
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


</style>
