/**
 * 
 */

(function() {
	var parentCSSList = [
	                     ];
	var parentJSList = [
	                    "OpenLayers.js"
	                    ];
	
	function parentJSInit() {
		var jbName = "SldCreator.js";
		

		var s = document.getElementsByTagName('script'), src, m, l = "";
		
		for (var i = 0, len = s.length; i < len; i++) {
			src = s[i].getAttribute('src');
			if (src) {
				m = src.split(jbName);
				if (m && m.length && m.length > 1) {
					l = m[0];
					break;
				}
			}
		}
		
		var scriptTags = new Array(parentCSSList.length + parentJSList.length);
		var idx = 0;
		
		for(var i=0,cnt=parentCSSList.length; i<cnt; i++) {
			scriptTags[idx++] = '<link rel="stylesheet" type="text/css" href="'+(l + parentCSSList[i])+'" />';
		}
		
		for(var i=0,cnt=parentJSList.length; i<cnt; i++) {
			scriptTags[idx++] = '<script type="text/javascript" src="'+(l + parentJSList[i])+'" charset="utf-8"></script>';
		}
		
		if (scriptTags.length > 0) {
            document.write(scriptTags.join(""));
        }
	}
	
	parentJSInit();
})();

var SLD_FILTER = {
			EQUAL_TO : "EQUAL_TO",
			LESS_THAN : "LESS_THAN",
			GREATER_THAN : "GREATER_THAN",
			LESS_EQUAL : "LESS_THAN_OR_EQUAL_TO",
			GREATER_EQUAL : "GREATER_THAN_OR_EQUAL_TO",
			BETWEEN : "BETWEEN",
			AND : "AND",
			OR : "OR"
		}

var SLD_FEATURE = {
	POLYGON : "polygon",
	LINE : "line",
	POINT : "point",
	CIRCLE : "circle",
	NONE : "none",
	TEXT : "text"
}

var SldCreator = function() {
	
	var defaultStyle = {
			"Polygon" : {
				fillOpacity: "0",
				strokeColor: "#C5C5C5",
				strokeWidth: "0.0",
				strokeOpacity: "0.0"
			},
			"Line" : {
				strokeColor: "#C5C5C5",
				strokeWidth: "0.0",
				strokeOpacity: "0.0"
			},
			"Point" : {
				fillOpacity: "0",
				strokeColor: "#C5C5C5",
				strokeWidth: "0.0",
				strokeOpacity: "0.0"
			}
	}
	
	function getComparisonFilter(type, property, value1, value2) {
		var comparison = null;
		
		if(type == SLD_FILTER.BETWEEN) {
			comparison = new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison[type],
				property: property,
				lowerBoundary: value1,
				upperBoundary: value2
			});
		}else{
			comparison = new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison[type],
				property: property,
				value: value1
			});
		}
		
		return comparison;
	}
	
	function getLogicalFilter(type, arr) {
		var logical = new OpenLayers.Filter.Logical({
			filters : arr,
			type : OpenLayers.Filter.Logical[type]
		});
		
		return logical;
	}
	
	function getPolygonStyle(myStyle) {
		var style = {
				"Polygon": {
					fillColor: "#ee9900",
					fillOpacity: 0.4,
					strokeColor: "#ee9900",
					strokeWidth: 1,
					strokeOpacity: 1
				}
		};
		
		if(myStyle) {
			if(myStyle.fillColor){
				style["Polygon"].fillColor = myStyle.fillColor;
			}
			
			if(myStyle.fillOpacity){
				style["Polygon"].fillOpacity = myStyle.fillOpacity;
			} 
			
			if(myStyle.strokeColor){
				style["Polygon"].strokeColor = myStyle.strokeColor;
			} 
			
			if(myStyle.strokeWidth){
				style["Polygon"].strokeWidth = myStyle.strokeWidth;
			} 
			
			if(myStyle.strokeOpacity){
				style["Polygon"].strokeOpacity = myStyle.strokeOpacity;
			} 
		}
		
		return style;
	}
	
	function getPointStyle(myStyle) {
		var style = {
				"Point": {
					fillColor: "#ee9900",
					fillOpacity: 0.4,
					strokeColor: "#ee9900",
					strokeWidth: 1,
					strokeOpacity: 1
				}
		};
		
		if(myStyle) {
			if(myStyle.fillColor){
				style["Point"].fillColor = myStyle.fillColor;
			}
			
			if(myStyle.fillOpacity){
				style["Point"].fillOpacity = myStyle.fillOpacity;
			} 
			
			if(myStyle.strokeColor){
				style["Point"].strokeColor = myStyle.strokeColor;
			} 
			
			if(myStyle.strokeWidth){
				style["Point"].strokeWidth = myStyle.strokeWidth;
			} 
			
			if(myStyle.strokeOpacity){
				style["Point"].strokeOpacity = myStyle.strokeOpacity;
			} 
		}
		
		return style;
	}
	
	function getLineStyle(myStyle) {
		var style = {
				"Line": {
					strokeColor: "#ee9900",
					strokeWidth: 1,
					strokeOpacity: 1
				}
		};
		
		if(myStyle) {
			if(myStyle.strokeColor){
				style["Line"].strokeColor = myStyle.strokeColor;
			} 
			
			if(myStyle.strokeWidth){
				style["Line"].strokeWidth = myStyle.strokeWidth;
			} 
			
			if(myStyle.strokeOpacity){
				style["Line"].strokeOpacity = myStyle.strokeOpacity;
			} 
		}
		
		return style;
	}
	
	function getRule(myStyle, myFilter) {
		
		var ruleParam = {
				symbolizer: myStyle
		};
		
		if(myFilter) {
			ruleParam["filter"] = myFilter;
		}
		
		var rule = new OpenLayers.Rule(ruleParam);
		
		return rule;
	}
	
	function getRuleStyles(styleName, ruleArr){
		var arr = null;
		try{
			if(typeof ruleArr.length == "undefined") {
				arr = [ruleArr];
			}else{
				arr = ruleArr;
			}
		}catch(e) {
			arr = [ruleArr];
		}
		var colorStyle = new OpenLayers.Style(styleName, {
			rules : arr
		});
		
		return colorStyle;
	}
	
	function getSldString(layerName, ruleStylesArr){
		var arr = null;
		try{
			if(typeof ruleStylesArr.length == "undefined") {
				arr = [ruleStylesArr];
			}else{
				arr = ruleStylesArr;
			}
		}catch(e) {
			arr = [ruleStylesArr];
		}
		var sldBody = new OpenLayers.Format.SLD().write({
			namedLayers: [{
				name: layerName,
				userStyles: arr
			}]
		});
		
		/*
		 *  IE 11에서 SLD가 오류나는 문제를 위한 임시방편.... 나중에 OpenLayers가 해당 버그를 수정시 아래 내용 제거
		 */
		
		if(sldBody.indexOf("NS") != -1){
			var changestr = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"';
			
			var sldArr = sldBody.split(">");
			
			for(var i=0, cnt=sldArr.length; i<cnt; i++){
				if(i==0){
					sldBody = changestr; 
				}else{
					sldBody += sldArr[i];
				}
				if(sldArr[i] != ""){
					sldBody += ">";
				}
			}
			
		}
		/*
		 *  여기까지...
		 */
		
		return sldBody;
	}
	
	var _self = {
		getComparisonFilter : function(type, property, value1, value2) {
			return getComparisonFilter(type, property, value1, value2);
		},
		
		getLogicalFilter : function(type, arr) {
			return getLogicalFilter(type, arr);
		},
		
		getSldStyle : function(type, myStyle) {
			if(type == SLD_FEATURE.POLYGON) {
				return getPolygonStyle(myStyle);
			}else if(type == SLD_FEATURE.LINE) {
				return getLineStyle(myStyle);
			}else if(type == SLD_FEATURE.POINT) {
				return getPointStyle(myStyle);
			}
			return null;
		},
		
		getSldNoneStyle : function(type) {
			if(type == SLD_FEATURE.POLYGON) {
				return defaultStyle["Polygon"];
			}else if(type == SLD_FEATURE.LINE) {
				return defaultStyle["Line"];
			}else if(type == SLD_FEATURE.POINT) {
				return defaultStyle["Point"];
			}
			return null;
		},
		
		getRule : function(myStyle, myFilter) {
			return getRule(myStyle, myFilter);
		},
		
		getRuleStyles : function(styleName, ruleArr) {
			return getRuleStyles(styleName, ruleArr);
		},
		
		getSldString : function(layerName, ruleStylesArr) {
			return getSldString(layerName, ruleStylesArr);
		}
	};
	
	return _self;
};