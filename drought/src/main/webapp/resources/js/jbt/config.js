var JBVal = {
		INTERVAL : {
			SHOW_ALARM_ALERT : 10000
		}
};

var JBCode = {
		SYSTEM_NAME : "재난대응 시스템",
		IS_PRIVATE : false,
		IS_MOBILE : false,
		CONTROL : {
			GRID : "grid"
		},
		FEATURE : {
			TYPE : {
				POLYGON : "polygon",
				LINE : "line",
				POINT : "point",
				CIRCLE : "circle",
				NONE : "none",
				TEXT : "text",
				FREEHAND : "freehand"
			}
		},
		MAP : {
			PROJECTION : 3857,
			VWORLD : {
				BASE : "VBASE",
				HYBRID : "VSAT"
			},
			GOOGLE : "google",
			OSM : "osm",
			MAX_ZOOMLEVEL : 18,
		},
		MAP_3D :{
			ICON : {
				FIRE_SENSOR : "fire_sensor",
				CCTV : "cctv_icon",
				WEATHER : "weather"
			}
		},
		EVENT : {
			MOVE_END : "moveend",
			ZOOM_END : "zoomend",
			CLICK : "click",
			MOUSE_MOVE : "mousemove",
			MOVE : "move",
			MOVE_START : "movestart",
			ON : "on",
			OFF : "off"
		},
		HISTORY : {
			NEXT : "next",
			PREVIOUS : "previous"
		},
		WEATHER : {
			TEMP : "temperature",
			WIND : "wind_spd",
			RAIN_10m : "rain_10m",
			RAIN_01h : "rain_01h",
			RAIN_03h : "rain_03h",
			RAIN_06h : "rain_06h",
			RAIN_12h : "rain_12h",
			RAIN_24h : "rain_24h"
		},
		FILTER : {
			EQUAL_TO : "EQUAL_TO",
			NOT_EQUAL_TO : "NOT_EQUAL_TO",
			LESS_THAN : "LESS_THAN",
			GREATER_THAN : "GREATER_THAN",
			LESS_EQUAL : "LESS_THAN_OR_EQUAL_TO",
			GREATER_EQUAL : "GREATER_THAN_OR_EQUAL_TO",
			BETWEEN : "BETWEEN",
			AND : "AND",
			OR : "OR",
		},
		MODE : {
			AUTO : "AUTO",
			MANUAL : "MANUAL",
			OFF : "OFF"
		},
		TIMER : {
			SEC_1 : 1,
			SEC_2 : 2,
			SEC_5 : 5,
			SEC_10 : 10,
			SEC_20 : 20,
			SEC_30 : 30,
			MIN_1 : 60,
			MIN_5 : 300,
			MIN_10 : 600,
			MIN_30 : 1800,
			HOUR_1 : 3600,
			HOUR_3 : 10800,
			HOUR_6 : 21600,
			HOUR_12 : 43200,
			HOUR_24 : 86400
		},
		CONTENT : {
			SAMPLE : "sample",
			SCENARIO : "sna",
			WEATHER : "weather",
			FIRE_SENSOR : "fire_sensor",
			ICCTV : "icctv",
			TWITTER : {
				TOTAL : "tw",
				ANALYSIS : "tw_anys",
				REAL : "tw_real"
			},
			MOBILE : {
				TOTAL : "sms",
				MMS : "sms_mms",
				STREAM : "sms_stm",
				VOD : "sms_vod",
				SEND : "sms_snd"
			},
			CCTV : {
				TOTAL : "cv",
				ITS : "cv_its",
				NPA : "cv_npa",
				KWATER : "cv_kwt",
				NEMA : "cv_nema",
				IPCCTV : "cv_ipcctv",
				NVR : "cv_nvr",
				USR : "cv_usr"
			},
			SPREAD : {
				TOTAL : "sprd",
				MESSAGE : "sprd_msg",
				CHAT : "sprd_cht",
				VIDEO : "sprd_video"
			},
			RADAR : {
				TOTAL : "radar",
				KMA : "radar_kma",
				SKP : "radar_skp"
			},
			SATELLITE : {
				TOTAL : "satellite",
				KMA : "satellite_kma",
				SKP : "satellite_skp"
			},
			USER_LAYER : "usr_lyr",
			TIDE_LEVEL : "tide_lvl",
			SLOPE : "ndmi_slope",
			KOOS_VELOCITY : "koos_vcy",
			KICT_RADAR : "kict_rdr",
			TWITTER_AREA : "topic_area",
			HEAT_CHART : "ndmi_heat",
			PAST_DB : "past_db",
			FOREST_FIRE : "forest_fire",
			FLOOD : "flood",
			SENSOR : "sensor",
			BROAD : "broad",
			NDMS : {
				FOA_FIRE_INFO : "ndms_foa",
				CONEARTH : "ndms_earth",
				RTSAOCCUR : "ndms_rtsa",
				KHCACC : "ndms_khc"
			},
			COLD_WAVE : "cold_wave",
			RADIATION : "radiation",
			RESPONSE : {
				MANAGER : "response",
				LIST : "response_list"
			},
			ADJACENT_CITY : 'adjacent_city',
		},
		POSITION : {
			LEFT_TOP : "lt",
			CENTER_TOP : "ct",
			RIGHT_TOP : "rt",
			LEFT_MIDDLE : "lm",
			CENTER_MIDDLE : "cm",
			RIGHT_MIDDLE : "rm",
			LEFT_BOTTOM : "lb",
			CENTER_BOTTOM : "cb",
			RIGHT_BOTTOM : "rb"
		},
		PLAY_TYPE : {
			SIMULATOR : "simulator",
			CURRENT : "current",
			CUSTOM : "custom"
		},
		TV : {
			YONHAP : "yonhap",
			KTV : "ktv",
			YTN : "ytn"
		},
		POPUP : {
			MAP : {
				NAME : "mapPopup",
				ZINDEX : 2000,
			},
			COMMON : {
				NAME : "commonPopup",
				ZINDEX : 10000
			},		
			COMMON : {
				NAME : "commonPopup",
				ZINDEX : 10000
			},	
			SYSTEM : {
				NAME : "systemPopup",
				ZINDEX : 11000
			},
			ALERT : {
				NAME : "alertPopup",
				ZINDEX : 20000
			}
		},
		REPLACECODE : {
				temperature : "기온",
				wind_spd : "풍속",
				rain_10m : "강우(10M)",
				rain_01h : "강우(1H)",
				rain_03h : "강우(3H)",
				rain_06h : "강우(6H)",
				rain_12h : "강우(12H)",
				rain_24h : "강우(24H)"
		},
		
		REPLACEUNIT : {
			temperature:"℃",
			wind_spd:"m/s",
			rain:"mm"
		},
		
		REPLACEFILTER : {
			EQUAL_TO : "",
			GREATER_THAN_OR_EQUAL_TO : "이상",
			GREATER_THAN : "초과",
			LESS_THAN_OR_EQUAL_TO : "이하",
			LESS_THAN : "미만"
		},
		
		DELETE : {
			ID : "삭제계정"
		},
		
		ITEM_WIDTH : {
			TWEET_LI :  281,
			MMS_LI : 325
			
		},
		
		MODIFY : {
			NONE : "none",
			RESHAPE : 1,
			RESIZE : 2,
			ROTATE : 4,
			DRAG : 8,
			CANCEL : "cancel",
			RADIUS : "radius"
		},
		
		UPDATED : {
			BIGDATA_DAUM_ISSUE_TOPIC : "빅데이터 급상승 키워드",
			BIGDATA_DAUM_TOPIC : "빅데이터 키워드",
			BIGDATA_DAUM_TOPIC_BY_GEO : "빅데이터 키워드 시도별",
			BIGDATA_DAUM_TOPIC_TRANSITION : "빅데이터 키워드 시간별",
			BIGDATA_TWITTER : "빅데이터 트윗",
			CCTV_ITS : "국가교통정보센터 CCTV",
			CCTV_NEMA : "소방방재청 CCTV",
			KMA_AWS_MIN : "기상청 AWS 관측자료"
		},

		PORT : 9000,
		
		ACODE : 97,
		
		STREAM_SERVER_URL : "210.221.217.211",
		
		GLOTECH_REALSTREAM_URL : "http://www.iseeusee.co.kr:8080/sbb/sbbview_new.jsp?ip=210.221.217.211",
};
/*
var titles = document.getElementsByTagName("TITLE");
for(var i=0,cnt=titles.length; i<cnt; i++) {
	var title = titles[i];
	title.innerHTML = JBCode.SYSTEM_NAME;
}
*/
var systemNames = document.getElementsByClassName("system_name");
for(var i=0,cnt=systemNames.length; i<cnt; i++) {
	var title = systemNames[i];
	title.innerHTML = JBCode.SYSTEM_NAME;
}