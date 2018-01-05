/**
 * 
 */
/*
 * 필요 라이브러리 등록
 */
(function() {
	/*
	 * MAP 사용 코드
	 */
	MAP_CODE = {
			MAP_TYPE : {
				BASE : {
					NAME : "base",
					CODE : "base",
					IMAGE_TYPE : "png",
					TITLE : "일반지도",
					MIN_ZOOM : 7,
					MAX_ZOOM : 17
				},
				SAT : {
					NAME : "sat",
					CODE : "sat",
					IMAGE_TYPE : "jpg",
					TITLE : "위성지도",
					MIN_ZOOM : 7,
					MAX_ZOOM : 19
				},
				LABEL : {
					NAME : "label",
					CODE : "label",
					IMAGE_TYPE : "png",
					TITLE : "지도라벨",
					MIN_ZOOM : 7,
					MAX_ZOOM : 17
				},
				OSM : {
					NAME : "osm",
					CODE : "osm",
					IMAGE_TYPE : "png",
					TITLE : "OSM",
					MIN_ZOOM : 0,
					MAX_ZOOM : 20
				},
				VWORLD_BASE : {
					NAME : "vworld_base",
					CODE : "Base",
					IMAGE_TYPE : "png",
					TITLE : "일반지도",
					MIN_ZOOM : 7,
					MAX_ZOOM : 17
				},
				VWORLD_SAT : {
					NAME : "vworld_sat",
					CODE : "Satellite",
					IMAGE_TYPE : "jpeg",
					TITLE : "위성지도",
					MIN_ZOOM : 7,
					MAX_ZOOM : 17
				},
				VWORLD_LABEL : {
					NAME : "vworld_label",
					CODE : "Hybrid",
					IMAGE_TYPE : "png",
					TITLE : "지도라벨",
					MIN_ZOOM : 7,
					MAX_ZOOM : 17
				}
			},
			MAP_PATH : "",
			TOOLTIP : {
				HELP : {
					OBJECT : null,
					ELEMENT : null
				},
				FEATURE : {
					OBJECT : null,
					ELEMENT : null
				},
				MEASURE : {
					OBJECT : null,
					ELEMENT : null,
					REMOVE : new Array()
				}
			},
			MEASURE : {
				NAME : "measure",
				SKETCH : null,
				LENGTH : "LineString",
				AREA : "Polygon",
				EXIT : "none"
			},
			EVENTS : {
				POINTER_MOVE : "pointermove",
				MOVE_END : "moveend",
				CLICK : "click"
			},
			DRAW : {
				DRAW_TYPE : {
					SINGLE : "single",
					MULTI : "multi"
				},
				POINT : "Point",
				LINE : "LineString",
				POLYGON : "Polygon"
				//수정 기능의 부재로 Circle은 제한함...
				/*,CIRCLE : "Circle"*/
			}
	}
	
	var parentCSSList = [
	                     "ol.css",
	                     "css/custom.ol.css"
	                     ];
	
	var parentJSList = [
	                    "ol-debug.js"
	                    ];
	
	var dependencyJSList = {
			
	}
	
	function parentJSInit() {
		var jbName = "JBMap.js";
		
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
		
		MAP_CODE.MAP_PATH = l;
		
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

/*
 * Map 객체 생성
 * Options = {
 * 		mapDiv : String, 							//Map을 틍록할 Division
 *  	baseMap : CODE - MAP_CODE.MAP_TYPE.*, 		//시작시 보여줄 지도 선정
 *  	setMoving : Boolean, 						//지도 이동시 애니메이션 기능 추가
 *  	isGeoDesic : Boolean						//Measure 기능 사용시 GeoDesic 기능 사용 여부
 * }
 */
var Map = function(options) {
	
	if(!options) {
		options = {};
	}
	
	var map = null;
	
	var PROJ = {
			MAIN : 'EPSG:900913',
			DISPLAY : 'EPSG:4326'
	}
	
	var wgs84Sphere = new ol.Sphere(6378137);
	
	var DEF_POS = {
			LONLAT : transform(126.98174453971292, 36.35599818899064),		//[14260423.181013038, 4347205.637594916]
			ZOOM : 7
	}
	
	var layers = {
			base : {},
			wms : {},
			vector : {},
			image : {}
	};
	
	var jbtLogo = new ol.Attribution({
		  html: 'Tiles &copy; <a href="http://www.enjoybt.co.kr/">' +
	      'JBT(enJoy Best Technologies)</a>'
	});
	
	var vworldLogo = new ol.Attribution({
		html : 'Tiles &copy; <a href="http://www.vworld.kr"/>' + 'VWORLD</a>'
	});
	
	var jbtImage = MAP_CODE.MAP_PATH + "img/jbt_logo.png";
	
	var mainMap = options.baseMap || MAP_CODE.MAP_TYPE.SAT.NAME;
	
	var controls = {};
	
	var interactions = {};
	
	var view = null;
	
	var events = {};
	
	var geoDesicCheck = options.isGeoDesic || false;
	
	var isMoveing = options.setMoving || false;
	
	var showBaseLayerCount = 2;
	
	var wktFormat = new ol.format.WKT();
	
	var kmlFormat = new ol.format.KML();
	
	var featureEvent = {};
	
	var selectLayer = [];
	
	var defaultStyle = new ol.style.Style({
		fill : new ol.style.Fill({
			color : 'rgba(255, 255, 255, 0.2)'
		}),
		stroke : new ol.style.Stroke({
			color : '#ffcc33',
			width : 2
		}),
		image : new ol.style.Circle({
			radius : 7,
			fill : new ol.style.Fill({
				color : '#ffcc33'
			})
		})
	});
	
	function transform(x, y, display) {
		try{
			if(display) {
				return ol.proj.transform([x, y], display, PROJ.MAIN);
			}else{
				return ol.proj.fromLonLat([x, y])
			}
		}catch(e) {
			return null;
		}
		
	}
	
	function init() {
		var option = {
				target : document.getElementById(options.mapDiv || "map"),
				loadTilesWhileAnimating: true,
				loadTilesWhileInteracting : true,
				logo : {
					src : jbtImage,
					href : "http://www.enjoybt.co.kr"
				}
		}
		
		view = new ol.View();
		option.view = view;
		
		map = new ol.Map(option);
		
		if(options.isTest) {
			window.testMap = map;
		}
		
		layers.base[MAP_CODE.MAP_TYPE.OSM.NAME] = new ol.layer.Tile({
			name : MAP_CODE.MAP_TYPE.OSM.NAME,
			source : new ol.source.OSM(),
			preload : 4
		});
		
		layers.base[MAP_CODE.MAP_TYPE.BASE.NAME] = new ol.layer.Tile({
			name : MAP_CODE.MAP_TYPE.BASE.NAME,
		    source: new ol.source.XYZ({
		    	attributions : [jbtLogo],
		        url: 'http://map.enjoybt.co.kr:7077/900913/1.0.0/mps_1207/{z}/{x}/{y}.png',
				maxZoom : MAP_CODE.MAP_TYPE.BASE.MAX_ZOOM
		      })
		    })
		
		layers.base[MAP_CODE.MAP_TYPE.SAT.NAME] = new ol.layer.Tile({
			name : MAP_CODE.MAP_TYPE.SAT.NAME,
			source : new ol.source.XYZ({
		    	attributions : [jbtLogo],
				url : 'http://www.bike.go.kr/resources/BMAP/900913/1.0.0/bike/{z}/{x}/{y}.jpg',
				//url : 'http://xdworld.vworld.kr:8080/2d/Satellite/201301/{z}/{x}/{y}.jpeg',
				maxZoom : MAP_CODE.MAP_TYPE.SAT.MAX_ZOOM
			})
		});
		
		layers.base[MAP_CODE.MAP_TYPE.LABEL.NAME] = new ol.layer.Tile({
			name : MAP_CODE.MAP_TYPE.LABEL.NAME,
			source : new ol.source.XYZ({
		    	attributions : [jbtLogo],
				url : 'http://map.enjoybt.co.kr:7077/900913/1.0.0/mps_1207_text/{z}/{x}/{y}.png',
		    	//url : 'http://xdworld.vworld.kr:8080/2d/Hybrid/201411/{z}/{x}/{y}.png',
				maxZoom : MAP_CODE.MAP_TYPE.LABEL.MAX_ZOOM
			}),
			visible : false
		});
		
		if(typeof vworldBaseMapUrl != "undefined" && typeof vworldVers != "undefined") {
			layers.base[MAP_CODE.MAP_TYPE.VWORLD_BASE.NAME] = new ol.layer.Tile({
				name : MAP_CODE.MAP_TYPE.VWORLD_BASE.NAME,
				source : new ol.source.XYZ({
			    	attributions : [vworldLogo],
			    	url : vworldBaseMapUrl + '/' + MAP_CODE.MAP_TYPE.VWORLD_BASE.CODE + '/'+ vworldVers[MAP_CODE.MAP_TYPE.VWORLD_BASE.CODE] +'/{z}/{x}/{y}.'+MAP_CODE.MAP_TYPE.VWORLD_BASE.IMAGE_TYPE,
					maxZoom : MAP_CODE.MAP_TYPE.VWORLD_BASE.MAX_ZOOM
				})
			});
			
			layers.base[MAP_CODE.MAP_TYPE.VWORLD_SAT.NAME] = new ol.layer.Tile({
				name : MAP_CODE.MAP_TYPE.VWORLD_SAT.NAME,
				source : new ol.source.XYZ({
			    	attributions : [vworldLogo],
			    	url : vworldBaseMapUrl + '/' + MAP_CODE.MAP_TYPE.VWORLD_SAT.CODE + '/'+ vworldVers[MAP_CODE.MAP_TYPE.VWORLD_SAT.CODE] +'/{z}/{x}/{y}.'+MAP_CODE.MAP_TYPE.VWORLD_SAT.IMAGE_TYPE,
					maxZoom : MAP_CODE.MAP_TYPE.VWORLD_SAT.MAX_ZOOM
				})
			});
			
			layers.base[MAP_CODE.MAP_TYPE.VWORLD_LABEL.NAME] = new ol.layer.Tile({
				name : MAP_CODE.MAP_TYPE.VWORLD_LABEL.NAME,
				source : new ol.source.XYZ({
			    	attributions : [vworldLogo],
			    	url : vworldBaseMapUrl + '/' + MAP_CODE.MAP_TYPE.VWORLD_LABEL.CODE + '/'+ vworldVers[MAP_CODE.MAP_TYPE.VWORLD_LABEL.CODE] +'/{z}/{x}/{y}.'+MAP_CODE.MAP_TYPE.VWORLD_LABEL.IMAGE_TYPE,
					maxZoom : MAP_CODE.MAP_TYPE.VWORLD_LABEL.MAX_ZOOM
				})
			});
		}

		map.addLayer(layers.base[MAP_CODE.MAP_TYPE.OSM.NAME]);
		map.addLayer(layers.base[MAP_CODE.MAP_TYPE.LABEL.NAME]);
		
		changeBaseLayer(mainMap);
		
		setControls();
		setIteractions();
		
		getInitPosition(true);

		for(var key in MAP_CODE.EVENTS) {
			var value = MAP_CODE.EVENTS[key];
			map.on(value, playEventHandler);
			events[value] = {};
		}
		
		var currZoomDiv = document.createElement("div");
		currZoomDiv.className = "ol-zoom-curr";
		currZoomDiv.innerHTML = view.getZoom();
		currZoomDiv.title = "Current Zoom Level";
		var olZoomDiv = document.getElementsByClassName("ol-zoom");
		if(olZoomDiv.length > 0) {
			var target = olZoomDiv[0];
			target.insertBefore(currZoomDiv, target.firstChild);
		}
		
		setEvent();
		
		var layerListDiv = document.createElement("div");
		layerListDiv.className = "layerListDiv";
		layerListDiv.setAttribute("id", "layerListDiv");
		
		var layerListTitle = document.createElement("div");
		layerListTitle.className = "layerListDivTitle";
		layerListTitle.innerHTML = "Layer Info";
		layerListDiv.appendChild(layerListTitle);
		
		var overlayContainer = document.getElementsByClassName("ol-overlaycontainer-stopevent");
		if(overlayContainer.length > 0) {
			overlayContainer = overlayContainer[0];
			overlayContainer.appendChild(layerListDiv);
		}
		layerItem();
		
		
	}
	
	function setEvent() {
		setEventHandler(MAP_CODE.EVENTS.MOVE_END, "CheckZoomLevel", function(e){
			var currDiv = document.getElementsByClassName("ol-zoom-curr");
			if(currDiv.length && currDiv.length > 0) {
				currDiv = currDiv[0];
				currDiv.innerHTML = view.getZoom();
			}
		});
		
		setEventHandler(MAP_CODE.EVENTS.POINTER_MOVE, "mousePointer", function(e){
			if (e.dragging) {
				return;
			}
			var pixel = map.getEventPixel(e.originalEvent);
			var hit = map.hasFeatureAtPixel(pixel);
			if(hit) {
				map.getTarget().style.cursor = 'pointer';
				var text = "";
				var geomArr = new Array();
				map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
					if(layer && feature){
						var layerName = layer.get("name");
						
						geomArr.push(e.coordinate);
						
						if(featureEvent[layerName] && featureEvent[layerName]["hover"]) {
							text += featureEvent[layerName]["hover"].call(this, feature) + "<br/>";
						}
					}
					
				});
				if(geomArr.length > 0 && text != "") {
					createOverlayPopup(geomArr, text);
				}
			}else{
				map.getTarget().style.cursor = '';
				createOverlayPopup();
			}
			
		});
		
		var selectClick = new ol.interaction.Select({
			condition : ol.events.condition.click,
			layers : selectLayer
			/*
			layers : function(e) {
				var bool = false;
				
				for(var i=0,cnt=selectLayer.length; i<cnt; i++) {
					var lyr = selectLayer[i];
					
					if(lyr.get('name') == e.get('name')){
						bool = true;
						break;
					}
				}
				
				return bool;
			}
			 */
		});
		
		setIteractions("featureSelect", selectClick);
		
		selectClick.on("select", function(e){
			var selectFeatures = e.selected;
			var unSelectFeatures = e.deselected;
			
			for(var i=0,cnt=selectFeatures.length; i<cnt; i++) {
				var feature = selectFeatures[i];
				var layerName = feature.layerName;
				if(layers.vector[layerName]){
					feature.setStyle(layers.vector[layerName].getStyle());
				}
				if(featureEvent[layerName] && featureEvent[layerName].select) {
					featureEvent[layerName].select.call(this, feature);
				}else{
					feature.setStyle(null);
				}
			}
			
			for(var i=0,cnt=unSelectFeatures.length; i<cnt; i++) {
				var feature = unSelectFeatures[i];
				var layerName = feature.layerName;
				feature.setStyle(null);
				if(featureEvent[layerName] && featureEvent[layerName].unselect) {
					featureEvent[layerName].unselect.call(this, feature);
				}
			}
		});
		
	}
	
	function createOverlayPopup(geomArr, text) {
		if(geomArr && text) {
			var geom = new ol.geom.Polygon([geomArr]);
			if(MAP_CODE.TOOLTIP.FEATURE.OBJECT == null) {
				if (MAP_CODE.TOOLTIP.FEATURE.ELEMENT) {
					MAP_CODE.TOOLTIP.FEATURE.ELEMENT.parentNode.removeChild(MAP_CODE.TOOLTIP.FEATURE.ELEMENT);
				}
				MAP_CODE.TOOLTIP.FEATURE.ELEMENT = document.createElement('div');
				MAP_CODE.TOOLTIP.FEATURE.ELEMENT.className = 'tooltip tooltip-feature';
				MAP_CODE.TOOLTIP.FEATURE.OBJECT = new ol.Overlay({
					element : MAP_CODE.TOOLTIP.FEATURE.ELEMENT,
					offset : [ 0, -15 ],
					positioning : 'bottom-center'
				});
				map.addOverlay(MAP_CODE.TOOLTIP.FEATURE.OBJECT);
			}

			MAP_CODE.TOOLTIP.FEATURE.ELEMENT.innerHTML = text;
			MAP_CODE.TOOLTIP.FEATURE.OBJECT.setPosition(geom.getInteriorPoint().getCoordinates());
		}else{
			map.removeOverlay(MAP_CODE.TOOLTIP.FEATURE.OBJECT);
			MAP_CODE.TOOLTIP.FEATURE.OBJECT = null;
		}
	}
	
	function layerItem() {
		
		var layerListDiv = document.getElementById("layerListDiv");
		var lyrs = getLayerList();

		while (layerListDiv.hasChildNodes()) {
			if(layerListDiv.childElementCount > 1) {
				layerListDiv.removeChild(layerListDiv.lastChild);
			}else{
				break;
			}
		}
		
		if(lyrs.length > 0) {
			for(var i=0,cnt=lyrs.length; i<cnt; i++) {
				var lyr = lyrs[i];
				var item = document.createElement("div");
				item.className = "layerItem";
				item.innerHTML = (lyr.zIndex+1)+". "+lyr.title;
				item.setAttribute("lyrId", lyr.id);
				item.setAttribute("lyrZIndex", lyr.zIndex);
				
				var buttonDiv = document.createElement("div");
				buttonDiv.className = "layerZIndexButtonDiv";
				item.appendChild(buttonDiv);
				
				var visible = document.createElement("img");
				visible.className = "layerView layerZIndexButton";
				
				var isVisible = "On";
				
				if(!lyr.isVisible) {
					isVisible = "Off";
				}
				
				visible.setAttribute("src", MAP_CODE.MAP_PATH + "img/layer"+isVisible+".png");
				buttonDiv.appendChild(visible);

				var up = document.createElement("img");
				up.className = "layerUp layerZIndexButton";
				up.setAttribute("src", MAP_CODE.MAP_PATH + "img/upButton.png");
				buttonDiv.appendChild(up);
				var down = document.createElement("img");
				down.className = "layerDown layerZIndexButton";
				down.setAttribute("src", MAP_CODE.MAP_PATH + "img/downButton.png");
				buttonDiv.appendChild(down);
				
				layerListDiv.appendChild(item);
				//layerListDiv.insertBefore(item, layerListDiv.nextSibling);
				
				visible.onclick = function() {
					try{
						var target = this.parentNode.parentNode.getAttribute('lyrid');
						var isVisible = true;
						if(this.getAttribute("src").indexOf("layerOn") != -1) {		//On
							isVisible = false;
						}
						setVisible(target, isVisible);
						this.setAttribute("src", MAP_CODE.MAP_PATH + "img/layer"+(isVisible ? "On" : "Off")+".png");
					}catch(e) {
						
					}
				}
				
				up.onclick = function(e) {
					try{
						var item = this.parentNode.parentNode;
						var id = item.getAttribute("lyrid");
						var zindex = item.getAttribute('lyrZIndex');
						
						if(zindex != 0) {
							changeLayerIndex(id, parseInt(zindex)-1);
						}
						
					}catch(e) {
						
					}
				}
				/*
				up.ondblclick = function(e) {
					try{
						var item = this.parentNode.parentNode;
						var id = item.getAttribute("lyrid");
						
						changeLayerIndex(id, 0);
					}catch(e) {
						
					}
				}
				
				down.ondblclick = function(e) {
					try{
						var item = this.parentNode.parentNode;
						var id = item.getAttribute("lyrid");
						var lyrs = getLayerList();
						
						changeLayerIndex(id, (lyrs.length - 1));
					}catch(e) {
						
					}
				}
				*/
				down.onclick = function(e) {
					try{
						var item = this.parentNode.parentNode;
						var id = item.getAttribute("lyrid");
						var zindex = item.getAttribute('lyrZIndex');
						var lyrs = getLayerList();
						if(zindex < (lyrs.length - 1)) {
							changeLayerIndex(id, parseInt(zindex)+1);
						}
					}catch(e) {
						
					}
				}
			}
		}else{
			var item = document.createElement("div");
			item.style.textAlign = "center";
			item.style.paddingLeft = "5px";
			item.style.paddingRight = "5px";
			item.style.width = "calc(100% - 10px)";
			item.className = "layerItem";
			item.innerHTML = "No Layer";
			layerListDiv.appendChild(item);
		}
		
		
	}
	
	function getExtent(type, outputProj) {
		var extent = view.calculateExtent(map.getSize());
		
		if(outputProj) {
			extent = ol.proj.transformExtent(extent, PROJ.MAIN, outputProj);
		}
		
		if(!type) {
			return extent;
		}else{
			var polygon = ol.geom.Polygon.fromExtent(extent);
			
			if("polygon" == type.toLowerCase()){
				return polygon;
			}else if("string" == type.toLowerCase()) {
				return wktFormat.writeGeometry(polygon);
			}
		}
	}
	
	function zoomToExtent(wktBounds, originProj) {
		var geom = wktFormat.readGeometry(wktBounds);
		
		if(originProj) {
			geom.transform(originProj, PROJ.MAIN);
		}else{
			geom.transform("EPSG:4326", PROJ.MAIN);
		}
		
		view.fitGeometry(geom, map.getSize(), {
			padding : [10, 10, 10, 10]
		});
	}
	
	function mapAddLayer(layer) {
		map.addLayer(layer);
		layerItem();
	}
	
	function mapRemoveLayer(layer) {
		map.removeLayer(layer);
		layerItem();
	}
	
	function playEventHandler(e) {
		
		var eventType = e.type;
		
		var callbackList = events[eventType];
		
		for(var key in callbackList) {
			var callback = callbackList[key];
			if(typeof callback == "function") {
				callback.call(this, e);
			}
		}
		
		switch(eventType) {
		case MAP_CODE.EVENTS.POINTER_MOVE :
			break;
		default :
			break;
		}
	}
	
	function setEventHandler(eventName, name, callback) {
		if(name && events[eventName]) {
			if(callback) {
				events[eventName][name] = callback;
			}else{
				delete events[eventName][name];
			}
		}
	}
	
	function setMeasureControl(type) {
		setIteractions(MAP_CODE.MEASURE.NAME);
		setEventHandler(MAP_CODE.EVENTS.POINTER_MOVE, MAP_CODE.MEASURE.NAME);
		createMeasureTooltip(false);
		createHelpTooltip(false);
		
		unSelectTrigger();
		
		if(type != MAP_CODE.MEASURE.AREA && type != MAP_CODE.MEASURE.LENGTH) {
			//map.removeLayer(layers.vector[MAP_CODE.MEASURE.NAME]);
			setVectorLayer(MAP_CODE.MEASURE.NAME);

			var removeList = MAP_CODE.TOOLTIP.MEASURE.REMOVE;
			for(var i=0,cnt=removeList.length; i<cnt; i++) {
				var remove = removeList[i];
				map.removeOverlay(remove);
			}
			MAP_CODE.TOOLTIP.MEASURE.REMOVE = new Array();
			
		}else{
			
			if(!layers.vector[MAP_CODE.MEASURE.NAME]) {
				var measureSource = new ol.source.Vector();
				
				var vectorStyle = new ol.style.Style({
					fill : new ol.style.Fill({
						color : 'rgba(255, 255, 255, 0.2)'
					}),
					stroke : new ol.style.Stroke({
						color : '#ffcc33',
						width : 2
					}),
					image : new ol.style.Circle({
						radius : 7,
						fill : new ol.style.Fill({
							color : '#ffcc33'
						})
					})
				});
				
				setVectorLayer(MAP_CODE.MEASURE.NAME, "거리·면적", measureSource, null, vectorStyle);
			}
			
			var draw = new ol.interaction.Draw({
				source : layers.vector[MAP_CODE.MEASURE.NAME].getSource(),
				type : type,
				style : new ol.style.Style({
					fill : new ol.style.Fill({
						color : 'rgba(255, 255, 255, 0.2)'
					}),
					stroke : new ol.style.Stroke({
						color : 'rgba(0, 0, 0, 0.5)',
						lineDash : [ 10, 10 ],
						width : 2
					}),
					image : new ol.style.Circle({
						radius : 5,
						stroke : new ol.style.Stroke({
							color : 'rgba(0, 0, 0, 0.7)'
						}),
						fill : new ol.style.Fill({
							color : 'rgba(255, 255, 255, 0.2)'
						})
					})
				})
			});
			
			setIteractions(MAP_CODE.MEASURE.NAME, draw);
			
			createMeasureTooltip(true);
			createHelpTooltip(true);
			
			draw.on('drawstart', function(e) {
				if(e.feature.getGeometry() instanceof ol.geom.Polygon) {
					//console.log("Polygon");
				}else if(e.feature.getGeometry() instanceof ol.geom.LineString){
					//console.log("line");
				}
				MAP_CODE.MEASURE.SKETCH = e.feature;
			}, this);
			
			draw.on('drawend', function(e) {
				MAP_CODE.TOOLTIP.MEASURE.ELEMENT.className = 'tooltip tooltip-static';
				MAP_CODE.TOOLTIP.MEASURE.OBJECT.setOffset([0, -7]);
				MAP_CODE.TOOLTIP.MEASURE.REMOVE.push(MAP_CODE.TOOLTIP.MEASURE.OBJECT);
				MAP_CODE.MEASURE.SKETCH = null;
				MAP_CODE.TOOLTIP.MEASURE.ELEMENT = null;
				createMeasureTooltip(true);
			}, this);
			
			setEventHandler(MAP_CODE.EVENTS.POINTER_MOVE, MAP_CODE.MEASURE.NAME, function(e) {
				//console.log(e);
				if (e.dragging) {
					return;
				}
				var helpMsg = 'Click to start drawing';
				var tooltipCoord = e.coordinate;

				var sketch = MAP_CODE.MEASURE.SKETCH;
				var measureTooltipElement = MAP_CODE.TOOLTIP.MEASURE.ELEMENT;
				var measureTooltip = MAP_CODE.TOOLTIP.MEASURE.OBJECT;
				var helpTooltipElement = MAP_CODE.TOOLTIP.HELP.ELEMENT;
				var helpTooltip = MAP_CODE.TOOLTIP.HELP.OBJECT;
				  
				if (sketch) {
					var output;
					var geom = (sketch.getGeometry());
					if (geom instanceof ol.geom.Polygon) {
				    	output = formatArea(geom);
				    	helpMsg = 'Click to continue drawing the polygon';
				    	tooltipCoord = geom.getInteriorPoint().getCoordinates();
				    } else if (geom instanceof ol.geom.LineString) {
				    	output = formatLength(geom);
				    	helpMsg = 'Click to continue drawing the line';
				    	tooltipCoord = geom.getLastCoordinate();
				    }
				    measureTooltipElement.innerHTML = output;
				    measureTooltip.setPosition(tooltipCoord);
				}

				helpTooltipElement.innerHTML = helpMsg;
				helpTooltip.setPosition(e.coordinate);
			});
		}
	}
	
	function formatLength(line) {
		var length;
		if (geoDesicCheck) {
			var coordinates = line.getCoordinates();
			length = 0;
			var sourceProj = view.getProjection();
			for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
				var c1 = ol.proj.transform(coordinates[i], sourceProj,
						'EPSG:4326');
				var c2 = ol.proj.transform(coordinates[i + 1], sourceProj,
						'EPSG:4326');
				length += wgs84Sphere.haversineDistance(c1, c2);
			}
		} else {
			length = Math.round(line.getLength() * 100) / 100;
		}
		var output;
		if (length > 100) {
			output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
		} else {
			output = (Math.round(length * 100) / 100) + ' ' + 'm';
		}
		return output;
	}
	
	function formatArea(polygon) {
		var area;
		if (geoDesicCheck) {
			var sourceProj = view.getProjection();
			var geom = polygon.clone().transform(sourceProj, 'EPSG:4326');
			var coordinates = geom.getLinearRing(0).getCoordinates();
			area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
		} else {
			area = polygon.getArea();
		}
		var output;
		if (area > 10000) {
			output = (Math.round(area / 1000000 * 100) / 100) + ' '	+ 'km<sup>2</sup>';
		} else {
			output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
		}
		return output;
	}
	
	function createMeasureTooltip(bool) {
		if(bool) {
			if (MAP_CODE.TOOLTIP.MEASURE.ELEMENT) {
				MAP_CODE.TOOLTIP.MEASURE.ELEMENT.parentNode.removeChild(MAP_CODE.TOOLTIP.MEASURE.ELEMENT);
			  }
			MAP_CODE.TOOLTIP.MEASURE.ELEMENT = document.createElement('div');
			MAP_CODE.TOOLTIP.MEASURE.ELEMENT.className = 'tooltip tooltip-measure';
			MAP_CODE.TOOLTIP.MEASURE.OBJECT = new ol.Overlay({
				element : MAP_CODE.TOOLTIP.MEASURE.ELEMENT,
				offset : [ 0, -15 ],
				positioning : 'bottom-center'
			});
			map.addOverlay(MAP_CODE.TOOLTIP.MEASURE.OBJECT);
		}else{
			map.removeOverlay(MAP_CODE.TOOLTIP.MEASURE.OBJECT);
		}
	}
	
	function createHelpTooltip(bool) {
		if(bool) {
			if (MAP_CODE.TOOLTIP.HELP.ELEMENT) {
				MAP_CODE.TOOLTIP.HELP.ELEMENT.parentNode.removeChild(MAP_CODE.TOOLTIP.HELP.ELEMENT);
			}
			MAP_CODE.TOOLTIP.HELP.ELEMENT = document.createElement('div');
			MAP_CODE.TOOLTIP.HELP.ELEMENT.className = 'tooltip';
			MAP_CODE.TOOLTIP.HELP.OBJECT = new ol.Overlay({
				element : MAP_CODE.TOOLTIP.HELP.ELEMENT,
				offset : [ 15, 0 ],
				positioning : 'center-left'
			});
			map.addOverlay(MAP_CODE.TOOLTIP.HELP.OBJECT);
		}else{
			map.removeOverlay(MAP_CODE.TOOLTIP.HELP.OBJECT);
		}
	}
	
	function setControls(name, control) {
		if(name) {
			var ctrl = null;
			if(controls[name]) {
				if(control) {
					ctrl = control;
				}else{
					ctrl = controls[name];
				}
				map.removeControl(ctrl);
			}
			if(control) {
				controls[name] = control;
				map.addControl(control);
			}else{
				delete controls[name];
			}
		}else{
			controls["zoomSlider"] = new ol.control.ZoomSlider();
			controls["rotate"] = new ol.control.Rotate({
				autoHide : false
			});
			controls["scaleLine"] = new ol.control.ScaleLine();
			for(var key in controls) {
				map.addControl(controls[key]);
			}

			var rotateImg = "<img src='"+MAP_CODE.MAP_PATH+ "img/compass.png' style='width:100%;'/>";
			var targetList = document.getElementsByClassName("ol-compass");
			for(var i=0,cnt=targetList.length; i<cnt; i++) {
				targetList[i].innerHTML = rotateImg;
			}
			
		}
	}
	
	function setIteractions(name, interaction) {
		if(name) {
			var itrt = null;
			if(interactions[name]) {
				if(interaction) {
					itrt = interaction;
				}else{
					itrt = interactions[name];
				}
				map.removeInteraction(itrt);
			}
			if(interaction) {
				interactions[name] = interaction;
				map.addInteraction(interaction);
			}else{
				delete interactions[name];
			}
		}else{
			interactions["rotateAndZoom"] = new ol.interaction.DragRotateAndZoom();
			
			for(var key in interactions) {
				map.addInteraction(interactions[key]);
			}
		}
	}
	
	function setInitPosition() {
		if(confirm("현재 지도 위치를 시작위치로 설정하시겠습니까?")) {
			try {
				localStorage.setItem("MAP_LV", view.getZoom());
			
				var currentCenter = view.getCenter();
				
				currentCenter = ol.proj.transform([currentCenter[0], currentCenter[1]], PROJ.MAIN, PROJ.DISPLAY);
				
				localStorage.setItem("MAP_CENTER_X", currentCenter[0]);
				localStorage.setItem("MAP_CENTER_Y", currentCenter[1]);
				localStorage.setItem("MAP_ROTATE", view.getRotation());
				
				alert("시작 위치가 설정되었습니다.");
			} catch(e) {
				alert("시작 위치 설정 중 오류가 발생했습니다.");
				
			}
		}
	}
	
	function getInitPosition(first) {
		var initMapLv = localStorage.getItem("MAP_LV");
		
		if(first) {
			view.setCenter(DEF_POS.LONLAT);
			view.setZoom(DEF_POS.ZOOM);
		}
		try{
			if(initMapLv) {
				var lon = parseFloat(localStorage.getItem("MAP_CENTER_X"));
				var lat = parseFloat(localStorage.getItem("MAP_CENTER_Y"));
				var zoom = parseInt(initMapLv);
				var rotate = parseFloat(localStorage.getItem("MAP_ROTATE"));
				
				movePosition(lon, lat, zoom, rotate);
				
			} else {
				if(first) {
					
				}else{
					alert("시작 위치 이동", "설정된 시작 위치가 없습니다. 먼저 시작 위치를 설정해주세요.");
				}
			}
		}catch(e) {
			
		}
	}
	
	function isEmpty(value) {
		return value == undefined || value == null;
	}
	
	function movePosition(x, y, zoom, rotate) {
		var lonlat = transform(x, y);
		
		if(isMoveing) {
			var duration = 2500;
			var currentRotation = view.getRotation();
			var start = +new Date();
			
			var resolution = view.getResolution() > 305.748113140705 ? view.getResolution() : 305.748113140705;
					
			var pan = ol.animation.pan({
				duration : duration,
				source : view.getCenter(),
				start : start
			});
			
			var bounce = ol.animation.bounce({
				duration : duration,
				resolution : resolution,
				start : start
			});

			var rotateAround = ol.animation.rotate({
				duration : duration,
				rotation : currentRotation,
				start : start
			});

			map.beforeRender(pan, bounce, rotateAround);
		}
		
		if(!isEmpty(lonlat)) {
			view.setCenter(lonlat);
		}
		
		if(!isEmpty(zoom)) {
			view.setZoom(zoom);
		}
		
		if(!isEmpty(rotate)) {
			view.rotate(rotate);
		}
	}
	
	function setWmsLayer(name, title, url, params, serverType, extent) {
		if(layers.wms[name]) {
			//map.removeLayer(layers.wms[name]);
			mapRemoveLayer(layers.wms[name]);
			delete layers.wms[name];
		}
		
		if(url) {
			if(!params) {
				params = {};
			}
			
			params._t = new Date().getTime();
			
			layers.wms[name] = new ol.layer.Image({
				name : name,
				title : title,
				layerType : "WMS",
			    source: new ol.source.ImageWMS({
			      url: url,
			      params: params
			    }),
			    serverType : serverType,
			    extent: extent
			  });
			
			//map.addLayer(layers.wms[name]);
			mapAddLayer(layers.wms[name]);
		}
	}
	
	function mergeNewParam(name, sldBody, style) {
		var layer = layers.wms[name];
		if(layer) {
			layer.getSource().updateParams({
				STYLES : style,
				SLD_BODY : sldBody
			});
		}
	}
	
	function changeBaseLayer(codeName) {
		if(codeName && layers.base[codeName]) {
			map.getLayers().setAt(0, layers.base[codeName]);
			var lonlat = view.getCenter();
			var zoom = view.getZoom();
			var rotate = view.getRotation();
			var codeKey = getMapTypeCode(codeName);
			
			if(codeName == MAP_CODE.MAP_TYPE.VWORLD_BASE.NAME || codeName == MAP_CODE.MAP_TYPE.VWORLD_SAT.NAME){
				map.getLayers().setAt(1, layers.base[MAP_CODE.MAP_TYPE.VWORLD_LABEL.NAME]);
			}else{
				map.getLayers().setAt(1, layers.base[MAP_CODE.MAP_TYPE.LABEL.NAME]);
			}
			
			var labelLayer = map.getLayers().getArray()[1];
			if(MAP_CODE.MAP_TYPE.OSM.NAME == codeName || MAP_CODE.MAP_TYPE.VWORLD_BASE.NAME == codeName){
				labelLayer.setVisible(false);
			}else{
				labelLayer.setVisible(true);
			}
			
			view = new ol.View({
				center: lonlat,
			    zoom: zoom,
			    rotation : rotate,
			    minZoom: codeKey == null ? 0 : MAP_CODE.MAP_TYPE[codeKey].MIN_ZOOM,
			    maxZoom: codeName == MAP_CODE.MAP_TYPE.OSM.NAME == codeName || codeKey == null ? '' : MAP_CODE.MAP_TYPE[codeKey].MAX_ZOOM
			});
			map.setView(view);
		}
	}
	
	function getMapTypeCode(codeName) {
		var mapType = MAP_CODE.MAP_TYPE;
		for(var key in mapType) {
			if(codeName == mapType[key].NAME) {
				return key;
			}
		}
		return null;
	}
	
	function changeLayerIndex(layerName, idx) {
		var lyrs = map.getLayers();
		var lyrIdx = -(showBaseLayerCount);
		var layer = null;
		idx += showBaseLayerCount;
		for(var i=0,cnt=lyrs.getLength(); i<cnt; i++) {
			var lyr = lyrs.item(i);
			if(lyr.get("name") == layerName) {
				lyrIdx = i;
				layer = lyr;
				break;
			}
		}
		if(layer != null) {
			lyrs.removeAt(lyrIdx);
			lyrs.insertAt(idx, layer);
		}
		layerItem();
	}
	
	function getLayerList() {
		var lyrs = map.getLayers();
		var output = new Array();
		for(var i=showBaseLayerCount,cnt=lyrs.getLength(); i<cnt; i++) {
			var lyr = lyrs.item(i);
			output.push({
				id : lyr.get("name"),
				title : lyr.get("title"),
				type : lyr.get("layerType"),
				zIndex : (i - showBaseLayerCount),
				isVisible : lyr.getVisible()
			});
		}
		
		return output;
	}
	
	function setFeatureOverlay(name, title, features, style) {
		if(layers.vector[name]) {
			//mapRemoveLayer(layers.vector[name]);
			layers.vector[name].setMap(null);
			delete layers.vector[name];
		}
		
		if(!title && !features && !style){
			return;
		}
		
		if(!style) {
			style = defaultStyle;
		}

		layers.vector[name] = new ol.FeatureOverlay({
			style : style,
			features : features
		});
		
		layers.vector[name].setMap(map);
	}
	
	/*
	 * name(String) : 벡터레이어 명 title(String) : 레이어 타이틀 features(Array) : Vector에
	 * 넣을 Features styles(ol.style.Style) : 벡터레이어의 기본 스타일
	 */
	function setVectorLayer(name, title, source, features, styles, selectCallback, unSelectCallback, hoverCallback) {
		if(layers.vector[name]) {
			//map.removeLayer(layers.vector[name]);
			mapRemoveLayer(layers.vector[name]);
			delete layers.vector[name];
			
			if(featureEvent[name]) {
				delete featureEvent[name];
			}
			
			for(var i=0,cnt=selectLayer.length; i<cnt; i++) {
				var layer = selectLayer[i];
				
				if(layer.get("name") == name) {
					selectLayer.splice(i, 1);
				}
			}
		}
		
		if(!title && !source && !features && !styles){
			return;
		}
		
		if(!source) {
			source = new ol.source.Vector();
		}
		
		layers.vector[name] = new ol.layer.Vector({
			name : name,
			title : title,
			layerType : "VECTOR",
			style : styles,
			source : source
		});
		
		//map.addLayer(layers.vector[name]);
		mapAddLayer(layers.vector[name]);
		
		if(features) {
			addFeatures(name, features);
		}
		
		if(selectCallback) {
			selectLayer.push(layers.vector[name]);
			featureEvent[name] = {};
			featureEvent[name]["select"] = selectCallback;
			featureEvent[name]["unselect"] = unSelectCallback;
			featureEvent[name]["hover"] = hoverCallback;
			
		}
	}
	
	function addFeatures(name, features) {
		//if(typeof features != "array"){
		if(!features.length){
			features = [features];
		}
		
		if(layers.vector[name]) {
			for(var i=0,cnt=features.length; i<cnt; i++) {
				var feature = features[i];
				
				feature.layerName = name;
			}
			
			layers.vector[name].getSource().addFeatures(features);
		}
	}
	
	function createFeature(wktGeom, attribute, style, isTransform) {
		var feature = null;
		if(typeof wktGeom == "string") {
			feature = wktFormat.readFeature(wktGeom);
		}else if(typeof wktGeom == "object"){
			feature = wktGeom;
		}else{
			return null;
		}

		if(isTransform) {
			feature.getGeometry().transform(PROJ.DISPLAY, PROJ.MAIN);
		}
		
		if(attribute) {
			feature.setProperties(attribute);
		}
		
		if(style) {
			feature.setStyle(style);
		}
		
		return feature;
	}
	
	function setVisible(name, bool) {
		
		for(var key in layers) {
			var layer = layers[key][name];
			if(layer) {
				layer.setVisible(bool);
				break;
			}
		}
		
		unSelectTrigger();
	}
	
	function unSelectTrigger() {
		var featureSelect = interactions["featureSelect"];
		
		if(featureSelect) {
			var f = featureSelect.getFeatures();
			
			if(f.getLength() > 0) {
				f = f.getArray()[0];
				
				f.setStyle(null);
				
				if(featureEvent[name] && featureEvent[name].unselect) {
					featureEvent[name].unselect.call(this, f);
				}
				
				featureSelect.getFeatures().remove(f);
			}
		}
	}
	
	function modifyFeatureControl(geomWKT, style, modifyEnd) {
		var modifyString = "modifyFeature";
		setIteractions(modifyString);
		setFeatureOverlay(modifyString);
		if(geomWKT) {
			var geomArray = JSON.parse(geomWKT);
			var featureArray = new Array();
			for(var key in geomArray) {
				var geomData = geomArray[key];
				var type = geomData.t;
				var geom = geomData.g;
				
				var geometry = "";
				
				if(type == "Circle") {
					var center = geomData.c;
					var radius = geomData.r;
					
					geometry = new ol.geom.Circle(center, radius);
				}else{
					geometry = wktFormat.readGeometry(geom);
				}
				
				//source.addFeature(new ol.Feature(geometry));
				featureArray.push(new ol.Feature(geometry));
				//console.log(geomData);
			}

			if(!layers.vector[modifyString]){
				if(!style) {
					style = defaultStyle;
				}
				//setVectorLayer(modifyString, "도형 수정하기", null, null, style);
				setFeatureOverlay(modifyString, "도형 수정하기", featureArray, style);
			}
			
			var modifyControl = new ol.interaction.Modify({
				  features: layers.vector[modifyString].getFeatures(),
				  deleteCondition : function(event) {
					  return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
				  }
				});
			
			setIteractions(modifyString, modifyControl);
			//console.log(geomWKT);
		}
		
	}
	
	function drawFeatureControl(type, style, drawType, drawend, isTransform) {
		var drawString = "drawFeature";
		setIteractions(drawString);
		if(type) {
			if(!layers.vector[drawString]){
				if(!style) {
					style = defaultStyle;
				}
				
				setVectorLayer(drawString, "도형그리기", null, null, style);
				
				if(!drawType) {
					drawType = MAP_CODE.DRAW.DRAW_TYPE.MULTI;
				}
				layers.vector[drawString].drawType = drawType;
			}
			
			var draw = new ol.interaction.Draw({
			    features: layers.vector[drawString].getSource().getFeatures(),
			    type: type
			  });
			
			setIteractions(drawString, draw);
			
			interactions[drawString].geomType = type;
			
			interactions[drawString].on("drawstart", function(e) {
				unSelectTrigger();
				
				var lyr = layers.vector[drawString];
				
				if(lyr) {
					var source = lyr.getSource();
					var drawType = lyr.drawType;
					
					if(interactions[drawString].geomType != MAP_CODE.DRAW.POINT && drawType == MAP_CODE.DRAW.DRAW_TYPE.SINGLE) {
						source.clear();
					}
				}
			});
			
			interactions[drawString].on("drawend", function(e) {
				unSelectTrigger();
				
				var f = e.feature;
				var lyr = layers.vector[drawString];
				if(lyr) {
					var source = lyr.getSource();
					var drawType = lyr.drawType;
					var geometryType = f.getGeometry().getType();
					
					if(geometryType == "Point" && drawType == MAP_CODE.DRAW.DRAW_TYPE.SINGLE) {
						source.clear();
					}
					/*
					if(geometryType == "Circle") {
						var circle = f.getGeometry();
						var center = ol.proj.transform(circle.getCenter(), PROJ.MAIN, PROJ.DISPLAY);
						var lastPoint = ol.proj.transform(circle.getLastCoordinate(), PROJ.MAIN, PROJ.DISPLAY);
						var radius = wgs84Sphere.haversineDistance(center, lastPoint);
						
						
						 * EPSG:4326으로 중심점과 거리를 만들어야 함... 
						 
						var geom = ol.geom.Polygon.circular(wgs84Sphere, center, radius); 
						geom.transform(PROJ.DISPLAY, PROJ.MAIN);
						f.setGeometry(geom);
					}
					*/
					source.addFeature(f);
					
					if(drawend){
						var features = source.getFeatures(); 
						/*
						 * OUTPUT은 EPSG:900913으로 됨...
						 */
						var geomArray = {};
						for(var i=0,cnt=features.length; i<cnt; i++) {
							var feature = features[i];
							var geometry = feature.getGeometry();
							var geomType = geometry.getType();
							
							var radius = 0;
							var center = [0,0];
							
							var geom = "";
							
							if(geomType == "Circle") {
								//center = ol.proj.transform(geometry.getCenter(), PROJ.MAIN, PROJ.DISPLAY);
								//radius = wgs84Sphere.haversineDistance(center, lastPoint);
								center = geometry.getCenter();
								radius = geometry.getRadius();
								
								var transCenter =  ol.proj.transform(geometry.getCenter(), PROJ.MAIN, PROJ.DISPLAY);
								var lastPoint = ol.proj.transform(geometry.getLastCoordinate(), PROJ.MAIN, PROJ.DISPLAY);
								//geom = wktFormat.writeGeometry(ol.geom.Polygon.circular(wgs84Sphere, center, radius)); 
								geom = wktFormat.writeGeometry(ol.geom.Polygon.circular(wgs84Sphere, transCenter, wgs84Sphere.haversineDistance(transCenter, lastPoint)).transform(PROJ.DISPLAY, PROJ.MAIN));
								
							}else{
								geom = wktFormat.writeGeometry(geometry);
							}
							
							geomArray[i] = {
									t : geomType,
									r : radius,
									c : center,
									g : geom
							};
						}
						
						if(isTransform) {
							
						}
						drawend.call(this, JSON.stringify(geomArray));
					}
				}
			}, this);
		}else{
			unSelectTrigger();
			setVectorLayer(drawString);
		}
	}
	
	function getMapPosition() {
		var center = ol.proj.transform(view.getCenter(), PROJ.MAIN, PROJ.DISPLAY);
		var zoom = view.getZoom();
		var rotate = view.getRotation();
		
		return {
			lon : center[0],
			lat : center[1],
			zoom : zoom,
			rotate : rotate
		}
	}
	
	function setImageLayer(name, title, url, extent, size, originProj) {
		if(layers.image[name]) {
			mapRemoveLayer(layers.image[name]);
			delete layers.image[name];
		}
		
		if(url) {
			if(url.indexOf("?") != -1) {
				url += "&time="+(new Date().getTime());
			}else{
				url += "?time="+(new Date().getTime());
			}
			
			var option = {};
			option.url = url;
			
			if(extent) {
				if(originProj) {
					extent = ol.proj.transformExtent(extent, originProj, PROJ.MAIN);
				}
				option.imageExtent = extent;
			}
			
			if(size) {
				option.imageSize = size;
			}
			
			layers.image[name] = new ol.layer.Image({
				name : name,
				title : title,
				layerType : "IMAGE",
			    source: new ol.source.ImageStatic(option)
			  });
			
			//map.addLayer(layers.wms[name]);
			mapAddLayer(layers.image[name]);
		}
	}
	
	init();
	return {
		getMap : function() {
			return map;
		},
		
		getLayer : function(name) {
			for(var key in layers.wms) {
				if(name == key) {
					return layers.wms[name];
				}
			}
			return null;
		},
		
		transform : function(x, y, display) {
			return transform(x, y, display);
		},
		
		setInitPosition : function() {
			setInitPosition();
		},
		
		getInitPosition : function() {
			getInitPosition();
		},
		
		getMapPosition : function() {
			return getMapPosition();
		},
		
		movePosition : function(x, y, zoom, rotate){
			movePosition(x, y, zoom, rotate);
		},
		
		getBounds : function() {
			return getExtent("string", "EPSG:4326");
		},
		
		getExtent : function(type, transProj){
			return getExtent(type, transProj);
		},
		
		zoomToExtent : function(wktBounds){
			zoomToExtent(wktBounds);
		},
		
		changeBaseLayer : function(code){
			changeBaseLayer(code);
		},
		
		setWmsLayer : function(name, title, url, params, serverType, extent){
			setWmsLayer(name, title, url, params, serverType, extent);
		},
		
		changeWmsStyle : function(name, sldBody, style) {
			mergeNewParam(name, sldBody, style);
		},
		
		setMeasureControl : function(type) {
			setMeasureControl(type);
		},
		
		changeLayerIndex : function(layerName, idx) {
			changeLayerIndex(layerName, idx);
		},
		
		getLayerList : function() {
			return getLayerList();
		},
		
		setVisible : function(name, bool){
			setVisible(name, bool);
		},
		
		createFeature : function(wktGeom, attribute, style, isTransform) {
			return createFeature(wktGeom, attribute, style, isTransform);
		},
		
		setVectorLayer : function(name, title, source, features, styles, selectCallback, unSelectCallback, hoverCallback) {
			setVectorLayer(name, title, source, features, styles, selectCallback, unSelectCallback, hoverCallback);
		},
		
		addFeatures : function(name, features) {
			addFeatures(name, features);
		},
		
		drawFeatureControl : function(type, style, drawType, drawend) {
			drawFeatureControl(type, style, drawType, drawend);
		},
		
		modifyFeatureControl : function(geomWKT, style, modifyEnd) {
			modifyFeatureControl(geomWKT, style, modifyEnd);
		},
		
		setImageLayer : function(name, title, url, extent, size, originProj){
			setImageLayer(name, title, url, extent, size, originProj);
		}
	}
}