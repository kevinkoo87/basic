package com.egov.drought.cmm.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.egov.drought.cmm.Constants;
import com.egov.drought.cmm.annotation.WebSocketMethod;
import com.egov.drought.cmm.service.CommonService;
import com.egov.drought.cmm.util.EgovBasicLogger;
import com.egov.drought.security.util.UserUtil;

@Controller
public class CommonController {
	
	@Value("#{config['MAIN_PAGE']}")
	private String mainPage;
	
	@Value("#{sysConfig['GIS_SERVER']}")
	private String gisServer;
	
	@Autowired
	private CommonService commonService;
	
	@RequestMapping(value="/index.do", method=RequestMethod.GET)
	public ModelAndView mainView() {
		ModelAndView view = new ModelAndView();
		EgovBasicLogger.info("Main Page : " + mainPage);
		EgovBasicLogger.info("GIS SERVER : " + gisServer);
		view.setViewName("index");
		String username = UserUtil.getUsername();
		EgovBasicLogger.debug("MainPage Init : " + username);
		view.addObject("username", username);
		return view;
	}
	
	@WebSocketMethod(path="webSocketResponse")
	public void webSocketResponse(Map<String, Object> param) {
		System.out.println("WebSocket Response : " + param.toString());
	}
	
	@ResponseBody
	@RequestMapping(value="/cmm/testBatch.do")
	public Map<String, Object> testBatch() {
		Map<String, Object> result = new HashMap<String, Object>();
		String resultStr = Constants.VALUE_RESULT_FAILURE;
		try{
			commonService.insertTestBatch();
			resultStr = Constants.VALUE_RESULT_SUCCESS;
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		result.put(Constants.KEY_RESULT, resultStr);
		return result;
	}
	
}
