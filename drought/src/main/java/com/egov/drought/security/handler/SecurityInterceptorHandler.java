package com.egov.drought.security.handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.egov.drought.security.LoginManager;
import com.egov.drought.security.util.UserUtil;

public class SecurityInterceptorHandler extends HandlerInterceptorAdapter {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SecurityInterceptorHandler.class);
	
	@Autowired
	private LoginManager loginManager;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		System.out.println("preHandle Init : " + request.getRequestURL());
		
		boolean bool = true;
		boolean isAjax = false;
		String redirectUrl = "/login/logout.do";
		
		try{
			String headerName = request.getHeader("X-Requested-With");
			if(headerName == null || !"xmlhttprequest".equals(headerName.toLowerCase())) {		//일반 처리 방식
				headerName = request.getHeader("isAjax");
				if(headerName != null) {
					isAjax = true;
				}
			}else{																				//Ajax Call
				isAjax = true;
			}
			
			HttpSession session = request.getSession();
			String username = UserUtil.getUsername();

			int sessionCode = loginManager.checkSession(username, session);

			System.out.println(username + " : " + session.getId() + "(" + sessionCode + ")");

			switch (sessionCode) {
			case 0 :		//로그인은 되어있으나 세션이 다름(다른사람이 로그인 함)
				if(isAjax) {
					response.setStatus(449);
				}
				bool = false;
				break;
			case 1 :		//로그인이 되어있고 세션도 동일함(본인이 로그인 함)
				break;
			case -1 :		//로그인이 되어있지 않음
				
				if(isAjax) {
					response.setStatus(440);
				}
				bool = false;
				break;
			default :
		}
			
		}catch(Exception e) {
			LOGGER.error("Security Interseptor Error", e);
			bool = false;
		}
		
		if(!isAjax && !bool) {
			response.sendRedirect(request.getContextPath() +  redirectUrl);
		}
		return bool;
	}
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		System.out.println("postHandle Init : " + request.getRequestURL());
	}
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)  throws Exception {
		System.out.println("afterCompletion Init : " + request.getRequestURL());
	}

}
