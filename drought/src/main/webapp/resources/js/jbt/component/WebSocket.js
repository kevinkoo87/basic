/**
 *  GeoBoard Component - WebSocket
 * 
 *  GeoBoard 내 websocket 통신을 관리한다.
 */

(function() {
	var scriptList = [
	                  {
	                	ObjNm : "SockJS",
	                	ScrptNm : "sockjs-0.3.4.js"
	                  }
	];
	
	function appendScript(jsUrl) {
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = jsUrl;
		document.head.appendChild(s);
		console.log("Init Script : " + jsUrl);
	};
	
	function getSrcPath(jsName) {
		var output = "";
		var scriptArr = document.getElementsByTagName("script");
		
		for(var i=0,cnt=scriptArr.length; i<cnt; i++) {
			var script = scriptArr[i];
			if(script.src.indexOf(jsName) != -1) {
				var srcName = script.src;
				output = srcName.substr(0, srcName.lastIndexOf(jsName));
			}
		}
		return output;
	}
	
	var jsPath = getSrcPath("WebSocket.js");
	
	for(var i=0,cnt=scriptList.length; i<cnt; i++) {
		var scrpt = scriptList[i];
		if(typeof window[scrpt.ObjNm] == "undefined") {
			appendScript(jsPath + "lib/" +scrpt.ScrptNm);
		}
	}
})();

var Socket = function(options) {
	if(!options) options = {};
	var url = typeof options.url == "undefined" ? location.hostname + "/websocket" : options.url;
	var port = typeof options.port == "undefined" ? 9000 : options.port;
	var username = typeof options.username == "undefined" ? null : options.username;
	var listener = {};
	var reqPath = "_PATH";
	var initInterval = null;
	
	var socket = null;
	
	function sendMessage(path, obj) {
		var data = {};
		data[reqPath] = path;
		if(typeof obj == "object") {
			var keys = Object.keys(obj);
			for(var i=0,cnt=keys.length; i<cnt; i++) {
				var objKey = keys[i];
				var val = obj[objKey];
				data[objKey] = val;
			}
		}else{
			data["VALUE"] = obj;
		}
		
		socket.send(JSON.stringify(data));
	}
	
	function onOpen(evt) {
		console.log(evt);
    }
    function onMessage(evt) {
    	var data = evt.data;
    	var arr = data.split("<:>");
    	var path = arr[0];
    	var d = arr[1];
    	if(listener[path]) {
    		listener[path].call(this, d);
    	}
    }
    function onError(evt) {
    	console.log(evt);
    }
    
    function setListener(path, func) {
    	removeListener(path);
    	listener[path] = func;
    }
    
    function removeListener(path) {
    	if(listener[path]) {
    		delete listener[path];
    	}
    }
	
	function init() {
//		socket = new SockJS(url);
		socket = new SockJS(url, null, {
			'protocols_whitelist': ['websocket', 'xdr-streaming', 'xhr-streaming', //
	                                'iframe-eventsource', 'iframe-htmlfile', 
	                                'xdr-polling', 'xhr-polling', 'iframe-xhr-polling',
	                                'jsonp-polling']
		});
		
		socket.onopen = function(evt) {
			onOpen(evt);
			if(typeof username != "undefined" && username != null) {
				sendMessage("INIT", username);
			}
			
			if(initInterval != null) {
				clearInterval(initInterval);
				initInterval = null;
			}
		}
		socket.onclose = function(evt) {
			console.log("WebSocket Close");
			initInterval = setInterval(function() {
				init();
			}, 5000);
		}
		socket.onmessage = function(evt) {
			onMessage(evt);
		}
		socket.onerror = function(evt) {
			onError(evt);
		}
		
		setListener("ECO", function(data) {
			console.log(data);
		});
	}
	
	init();
	return {
		
		init : function() {
			init();
		},
		
		sendMessage : function(path, obj) {
			sendMessage(path, obj);
		},
		
		setListener : function(path, func) {
			setListener(path, func);
		},
		
		removeResponseFunction : function(path) {
			removeListener(path);
		}
	
	}
};