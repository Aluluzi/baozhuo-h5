const callMobile = (handlerInterface, handlerMethod, parameters) => {
	var _this = this;
	//handlerInterface由iOS addScriptMessageHandler与andorid addJavascriptInterface 代码注入而来。
	var dic = {
		'handlerInterface': handlerInterface,
		'function': handlerMethod,
		'parameters': parameters
	};
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		window.webkit.messageHandlers[handlerMethod].postMessage(dic);
	} else {
		//安卓传输不了js json对象
		//window[handlerInterface][handlerMethod](JSON.stringify(dic));
		setupWebViewJavascriptBridge(function(bridge) {
			var data = JSON.stringify(dic);
			bridge.callHandler(handlerMethod, data, function(resp) {});
		})
	}
}
const setupWebViewJavascriptBridge = (callback) => {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge)
	} else {
		document.addEventListener(
			'WebViewJavascriptBridgeReady',
			function() {
				callback(WebViewJavascriptBridge)
			},
			false
		);
	}
}

export default {
	callMobile,
	setupWebViewJavascriptBridge
}
