const actions = {
    saveToken({commit}, data) {
        commit("saveToken", data);
    },
    setShowRealPrice({commit}, data) {
        commit("setShowRealPrice", data);
    },
    saveOrderList({commit}, data) {
        commit('saveOrderList', data)
    },
    saveTubesList({commit}, data) {
        commit('saveTubesList', data)
    },
    savePatientInfo({commit}, data) {
        commit('savePatientInfo', data)
    },
    saveEditTubes({commit}, data) {
        commit('saveEditTubes', data)
    },
    saveEditPatientInfo({commit}, data) {
        commit('saveEditPatientInfo', data)
    }
};

export default actions;
