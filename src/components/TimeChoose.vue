<template>
  <div class="TimeChoose">
    <div class="time-type" :class="type == 1 ? 'blue' : 'white'">
      <span
        :class="timeType == 'day' ? 'active' : ''"
        @click="chooseTimeType('day')"
        >日</span
      >
      <span
        :class="timeType == 'mon' ? 'active' : ''"
        @click="chooseTimeType('mon')"
        >月</span
      >
    </div>
    <div class="time-btn" :class="type == 1 ? 'blue' : 'white'">
      <i class="iconfont iconshangxiazuoyou-2" @click="previous"></i>
      <span @click="openTimePicker">{{ time }}</span>
      <i class="iconfont iconshangxiazuoyou-3" @click="next"></i>
    </div>

    <van-popup v-model="showPicker_day" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        :max-date="maxDate"
        type="date"
        title="选择日期"
        @confirm="choose"
        @cancel="showPicker_day = false"
      />
    </van-popup>
    <van-popup v-model="showPicker_mon" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        :max-date="maxDate"
        type="year-month"
        title="选择月"
        @confirm="choose"
        @cancel="showPicker_mon = false"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  getFormatDate,
  FillZero,
  getPreDate,
  getNextDate,
} from "@/utils/utils";
export default {
  name: "TimeChoose",
  data() {
    return {
      timeType: "day",
      time: "",
      currentDate: new Date(),
      maxDate: new Date(),
      showPicker_day: false,
      showPicker_mon: false,
    };
  },
  props: ["type"],
  components: {},
  created() {
    this.time = getFormatDate(this.currentDate, "ymd", ".");
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    chooseTimeType(type) {
      this.timeType = type;
      if (this.timeType == "day") {
        this.time = getFormatDate(this.currentDate, "ymd", ".");
        let val = getFormatDate(this.currentDate, "ymd", "-");
        this.$emit("getTime", { time: val, type: "day" });
      } else {
        this.time = getFormatDate(this.currentDate, "ym", ".");
        let val = getFormatDate(this.currentDate, "ym", "-");
        this.$emit("getTime", { time: val, type: "month" });
      }
    },
    choose(val) {
      this.showPicker_day = false;
      this.showPicker_mon = false;
      this.currentDate = val;
      if (this.timeType == "day") {
        this.time = getFormatDate(val, "ymd", ".");
        let value = getFormatDate(val, "ymd", "-");
        this.currentDate = new Date(value);
        this.$emit("getTime", { time: value, type: "day" });
      } else {
        this.time = getFormatDate(val, "ym", ".");
        let value = getFormatDate(val, "ym", "-");
        this.currentDate = new Date(value);
        this.$emit("getTime", { time: value, type: "month" });
      }
    },
    openTimePicker() {
      if (this.timeType == "day") {
        this.showPicker_day = true;
      } else {
        this.showPicker_mon = true;
      }
    },
    previous() {
      let time = this.time;
      const year = Number(time.split(".")[0]);
      const mon = Number(time.split(".")[1]);
      const day = this.timeType == "day" ? Number(time.split(".")[2]) : -1;

      this.time = getPreDate(year, mon, day, ".").FillZeroDate;
      let val = getPreDate(year, mon, day, "-").FillZeroDate;
      this.currentDate = new Date(val);
      if (this.timeType == "day") {
        this.$emit("getTime", { time: val, type: "day" });
      } else {
        this.$emit("getTime", { time: val, type: "month" });
      }
      // let txt = ''
      // if(day){
      //     if(day==1){
      //         if(mon==1){
      //             let nowYear = year-1
      //             txt = nowYear+'.12.31'
      //         }else{
      //             let nowMon = mon-1
      //             let bigMon = [1,3,5,7,8,10,12]
      //             let smallMon = [4,6,9,11]
      //             if(bigMon.includes(nowMon)){
      //                 txt = year+'.'+FillZero(nowMon, 2)+'.31'
      //             }else if(smallMon.includes(nowMon)){
      //                 txt = year+'.'+FillZero(nowMon, 2)+'.30'
      //             }else{
      //                 if (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)) {
      //                     txt = year+'.'+FillZero(nowMon, 2)+'.29'
      //                 } else {
      //                     txt = year+'.'+FillZero(nowMon, 2)+'.28'
      //                 }
      //             }
      //         }
      //     }else{
      //         let nowDay = FillZero(day-1, 2)
      //         txt = year+'.'+FillZero(mon, 2)+'.'+nowDay
      //     }
      // }else{
      //     if(mon==1){
      //         let nowYear = year-1
      //         txt = nowYear+'.12'
      //     }else{
      //         let nowMon = FillZero(mon-1, 2)
      //         txt = year+'.'+nowMon
      //     }
      // }
      // this.time = txt
      // this.currentDate = new Date(this.time)
      // let val = this.time.replace(/\./g, '-')
      // if(this.timeType=='day'){
      //     this.$emit('getTime',{time:val,type:'day'})
      // }else{
      //     this.$emit('getTime',{time:val,type:'month'})
      // }
    },
    next() {
      let time = this.time;
      // let txt = ''
      const year = Number(time.split(".")[0]);
      const mon = Number(time.split(".")[1]);
      const day = this.timeType == "day" ? Number(time.split(".")[2]) : null;

      if (getNextDate(year, mon, day, ".")) {
        this.time = getNextDate(year, mon, day, ".").FillZeroDate;
        let val = getNextDate(year, mon, day, "-").FillZeroDate;
        this.currentDate = new Date(val);
        if (this.timeType == "day") {
          this.$emit("getTime", { time: val, type: "day" });
        } else {
          this.$emit("getTime", { time: val, type: "month" });
        }
      } else {
        this.$toast("不能选择未来日期");
        return;
      }

      // const currentYear = Number(getFormatDate(new Date()).year)
      // const currentMon = Number(getFormatDate(new Date()).month)
      // const currentDay = Number(getFormatDate(new Date()).day)
      //
      // if(day){
      //     if(year>=currentYear&&mon>=currentMon&&day>=currentDay){
      //         this.$toast('不能选择未来日期')
      //         return
      //     }
      //     let bigMon = [1,3,5,7,8,10,12]
      //     let smallMon = [4,6,9,11]
      //     if(bigMon.includes(mon)){
      //         if(day==31){
      //             if(mon==12){
      //                 let nowYear = year+1
      //                 txt = nowYear+'.01.01'
      //             }else{
      //                 txt = year+'.'+FillZero(mon+1, 2)+'.01'
      //             }
      //         }else{
      //             txt = year+'.'+ FillZero(mon, 2) + '.' +FillZero(day+1, 2)
      //         }
      //     }else if(smallMon.includes(mon)){
      //         if(day==30){
      //             txt = year+'.'+FillZero(mon+1, 2)+'.01'
      //         }else{
      //             txt = year+'.'+ FillZero(mon, 2) + '.' +FillZero(day+1, 2)
      //         }
      //     }else{
      //         if (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)) {
      //             if(day==29){
      //                 txt = year+'.'+FillZero(mon+1, 2)+'.01'
      //             }else{
      //                 txt = year+'.'+ FillZero(mon, 2) + '.' +FillZero(day+1, 2)
      //             }
      //         } else {
      //             if(day==28){
      //                 txt = year+'.'+FillZero(mon+1, 2)+'.01'
      //             }else{
      //                 txt = year+'.'+ FillZero(mon, 2) + '.' +FillZero(day+1, 2)
      //             }
      //         }
      //     }
      // }else{
      //     if(year>=currentYear&&mon>=currentMon){
      //         this.$toast('不能选择未来日期')
      //         return
      //     }
      //     if(mon==12){
      //         let nowYear = year+1
      //         txt = nowYear+'.01'
      //     }else{
      //         let nowMon = FillZero(mon+1, 2)
      //         txt = year+'.'+nowMon
      //     }
      // }
      //
      //
      // this.time = txt
      // this.currentDate = new Date(this.time)
      // let val = this.time.replace(/\./g, '-')
      // if(this.timeType=='day'){
      //     this.$emit('getTime',{time:val,type:'day'})
      // }else{
      //     this.$emit('getTime',{time:val,type:'month'})
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "//at.alicdn.com/t/font_1840293_f3x4o76a5r.css";
.TimeChoose {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .time-type {
    display: flex;
    align-items: center;
    height: 1.4rem;
    width: 5rem;
    border-radius: 0.25rem;
    overflow: hidden;
    > span {
      height: 100%;
      width: 50%;
      text-align: center;
      line-height: 1.5rem;
      font-size: 0.7rem;
    }
  }
  .time-type.blue {
    border: 1px solid #fff;
    > span {
      color: #fff;
    }
    > span.active {
      background: #fff;
      color: #7c5cf2;
    }
  }
  .time-type.white {
    border: 1px solid #7c5cf2;
    > span {
      color: #7c5cf2;
    }
    > span.active {
      background: #7c5cf2;
      color: #fff;
    }
  }

  .time-btn {
    /*width: 4.2rem;*/
    height: 0.575rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > i.iconfont {
      font-size: 0.75rem;
      opacity: 0.8;
    }
    > span {
      font-size: 0.75rem;
      margin: 0 0.75rem;
    }
  }
  .time-btn.blue {
    > i.iconfont {
      color: #fff;
    }
    > span {
      color: #fff;
    }
  }
  .time-btn.white {
    > i.iconfont {
      color: #666;
    }
    > span {
      color: #333;
    }
  }
}
</style>