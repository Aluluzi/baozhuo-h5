import axios from 'axios'
import store from '@/store'
import {
	baseURL
} from '@/config'
import {
	Toast,
	Dialog
} from 'vant';
//import Qs from 'qs'
import {
	dealObjectValue,
	is_weixin,
	GetRequest,
	delParam
} from '@/utils/utils.js'
// 创建axios实例
const service = axios.create({
	// baseURL: '/apis',
	baseURL,
	timeout: 15000
});
// request拦截器
service.interceptors.request.use(
	config => {
		let type = config.method === 'get' ? 'params' : 'data';
		if (config[type] === undefined) config[type] = {};
		let {
			token
		} = store.state.tokenInfo;
		// let tokenInfo = dealObjectValue({
		// 	token,
		// });
		config[type] = {
			...config[type],
			// ...tokenInfo
		};
		config.headers.Authorization = token
		return config;
	},
	error => {
		Promise.reject(error)
	}
)
//respone拦截器
service.interceptors.response.use(
	response => {
		if (response.data.code === 200) {
			return response.data.data
		} else if (response.data.code === 302) {
			Toast(response.data.message);
			store.dispatch("saveToken", {});
			localStorage.removeItem('loginInfo');
			window.location.reload();
			// if (is_weixin()) {
				//登录信息失效清除登录信息
				// store.dispatch("saveToken", {});
				// localStorage.removeItem('loginInfo');
				// window.location.reload();
				//登录信息失效从新获取，若code失效防止接口挂了弹框阻止循环刷登录
				// let redirectUrl = window.location.href;
				// let {
				// 	code,
				// 	state
				// } = GetRequest(redirectUrl) // 截取url上的code ,可能没有,则返回''空字符串
				// if (code) {
				// 	redirectUrl = delParam('code', redirectUrl);
				// 	redirectUrl = delParam('state', redirectUrl);
				// 	Dialog.alert({
				// 		message: '登录失效,点击重新获取'
				// 	}).then(() => {
				// 		redirectUrl = encodeURIComponent(redirectUrl);
				// 		window.location.replace(`${baseURL}/site/wechat/redirect?official_account=1&redirect_url=${redirectUrl}`)
				// 	});
				// } else {
				// 	redirectUrl = encodeURIComponent(redirectUrl);
				// 	window.location.replace(`${baseURL}/site/wechat/redirect?official_account=1&redirect_url=${redirectUrl}`)
				// }
			// } else {
				// Toast(response.data.message);
			// }
		} else {
			Toast(response.data.message);
			return response.data.data
		}
	},
	error => {
		return Promise.reject(error)
	}
)
export const POST = (url, data) => service({
	url,
	method: 'post',
	data
});
export const GET = (url, params) => service({
	url,
	method: 'get',
	params
});