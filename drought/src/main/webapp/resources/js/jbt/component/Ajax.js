/**
 *  GeoBoard Component - Ajax 
 * 
 *  GeoBoard 내 ajax 통신을 관리한다.
 */

var Ajax = function(options) {
	
	if(typeof options == "undefined") options = {};
	var contextPath = typeof options.contextPath == "undefined" ? location.origin : options.contextPath; 
	var callCount = typeof options.count == "undefined" ? 5 : options.count;
	var isLog = typeof options.isLog == "undefined" ? false : options.isLog;
	var currentCount = 0;
	var delayList = [];
	
	function delayCall() {
		if(delayList.length > 0 && currentCount < callCount) {
			var target = delayList[0];
			delayList.splice(0, 1);
			call(target.url, target.method, target.params, target.async, target.success, target.error);
			delayCall();
		}
	}
	
	function call(url, method, params, async, success, error) {
		if(typeof async == "undefined" || async == null) async = true;
		if(async && currentCount >= callCount) {
			if(isLog) {
				console.log("요청개수가 많습니다. 조절해주시기 바랍니다.");
			}
			delayList[delayList.length] = {
					url : url,
					method : method,
					params : params,
					async : async,
					success : success,
					error : error
			}
			return;
		}
		
		currentCount++;
		
		if(method == null) method = "get";
		if(url.indexOf("http") == -1) url = contextPath+url;
		
		if(isLog){
			console.log("Request Ajax : " + url);
			console.log("       method : " + method);
			if(params != null) {
				console.log("       params : " + JSON.stringify(params));
			}else{
				console.log("       params : null");
			}
			console.log("       async : " + async);
		}
		
		return jQuery.ajax({
			url : url,
			type : method,
			data : params,
			dataType : "json",
			timeout : 30000,
			async : async,
			beforeSend : function(jqXHR, settings) {
				jqXHR.setRequestHeader("isAjax", true);
				try{
					var _csrf = jQuery("META[name='_csrf']").attr("content");
					var _csrf_header = jQuery("META[name='_csrf_header']").attr("content");
					if(!_csrf.isBlank() && !_csrf_header.isBlank()) {
						jqXHR.setRequestHeader(_csrf_header, _csrf);
					}
				}catch(e) {
					console.log(e);
				}
			},
			success : function(data) {
				currentCount--;
				if(currentCount < 0) {
					currentCount = 0;
				}
				delayCall();
				if(data) {
					if(data.RESULT == "SUCCESS") {
						success.apply(this, arguments);
					}else{
						if(isLog) {
							//console.log(data.EXCEPTION);
						}
						
						if(error) {
							error.apply(this, arguments);
						}
					}
				}else{
					if(isLog) {
						console.log(url+" 결과가 없습니다. 확인바랍니다.");
					}
				}
			},
			error : function(jqXHR, exception) {
				jQuery("#loading-mask").fadeOut();
				currentCount--;
				if(currentCount < 0) {
					currentCount = 0;
				}
				delayCall();
				if(isLog) {
					//console.log(exception);
				}
				if(error) {
					error.apply(this, arguments);
				}
			}
		});
	}
	
	return {
		call : function(url, method, params, async, success, error) {
			return call(url, method, params, async, success, error);
		}
	}
};