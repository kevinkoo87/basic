package com.egov.drought.security.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.egov.drought.cmm.Constants;
import com.egov.drought.cmm.util.EgovBasicLogger;
import com.egov.drought.security.LoginManager;
import com.egov.drought.security.util.RSAGenerator;
import com.egov.drought.security.util.UserUtil;

@Controller
public class LoginController {
	@Autowired
	private LoginManager loginManager;
	
	@Value("#{config['MAIN_PAGE']}")
	private String mainPage;
	
	@RequestMapping(value="/login/login.do")
	public ModelAndView viewLoginPage() {
		ModelAndView view = new ModelAndView();
		
		view.setViewName("login/login");
		
		return view;
	}
	
	@RequestMapping(value="/login/loginFail.do")
	public ModelAndView viewLoginFailPage(
			@RequestParam(value="error", required=true) String error,
			@RequestParam(value="target", required=false) String target
			) {
		ModelAndView view = new ModelAndView();
		view.addObject(Constants.KEY_RESULT, error);
		view.addObject(Constants.KEY_DATA, target);
		view.setViewName("login/loginFail");
		
		return view;
	}
	
	@RequestMapping(value="/login/logout.do")
	public String logout(HttpServletRequest request, HttpServletResponse response) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
		if(auth != null) {
			System.out.println("logout");
			new SecurityContextLogoutHandler().logout(request, response, auth);
		}
		
		return "redirect:/login/login.do";
	}
	
	@RequestMapping(value="/login/sessionLogin.do")
	public String sessionLogin(HttpServletRequest request) {
		
		String redirectUrl = mainPage; 
		
		try{
			String username = UserUtil.getUsername();
			HttpSession session = request.getSession();
			loginManager.resetSession(username, session);
		}catch(Exception e) {
			EgovBasicLogger.debug("/login/sessionLogin.do Error", e);
			redirectUrl = "/login/loginFail.do";
		}
		
		return "redirect:" + redirectUrl;
	}
	
	@ResponseBody
	@RequestMapping(value="/login/getPasswordEncoder.do", method=RequestMethod.POST)
	public Map<String, Object> createRsaSecurity(HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();
		String resultStr = Constants.VALUE_RESULT_FAILURE;
		try{
			String[] rsaEncoder = RSAGenerator.createRsaGenerator(request.getSession());
			if(rsaEncoder != null) {
				result.put("publicM", rsaEncoder[0]);
				result.put("publicE", rsaEncoder[1]);
			}
			
			resultStr = Constants.VALUE_RESULT_SUCCESS;
		}catch(Exception e) {
			EgovBasicLogger.debug("/login/getPasswordEncoder.do Error", e);
		}
		
		result.put(Constants.KEY_RESULT, resultStr);
		
		System.out.println(result);
		return result;
	}
}
