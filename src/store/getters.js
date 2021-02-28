const getters = {
    //实时监听state值的变化(最新状态)
    noToken(state) {
        const {token} = state.tokenInfo
        return token ? false : true
    }
}
export default getters
