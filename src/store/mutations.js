const mutations = {
  saveToken(state, data) {
    state.tokenInfo = data;
  },
  setShowRealPrice(state, data) {
    state.tokenInfo.show_real_price = data;
  },
  editEwmData(state, data) {
    state.ewmData = data;
  },
  editUserInfo(state, data) {
    state.userInfo = data;
  },
  editCan_balance_pay(state, can_balance_pay) {
    state.can_balance_pay = can_balance_pay;
  },
  saveOrderList(state, data) {
    state.orderList = data;
  },
  saveTubesList(state, data) {
    state.tubesList = data;
  },
  savePatientInfo(state, data) {
    state.patientInfo = data;
  },
  saveEditTubes(state, data) {
    state.editTubes = data;
  },
  saveEditPatientInfo(state, data) {
    state.editPatientInfo = data;
  },
};
export default mutations;
