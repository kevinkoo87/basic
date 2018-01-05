package com.egov.drought.security;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class CustomHttpSessionListener implements HttpSessionListener {

	private static int loginCnt = 0;

	@Override
	public void sessionCreated(HttpSessionEvent se) {
		++loginCnt;
		System.out.println("Login Count : " + loginCnt);
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		--loginCnt;
		System.out.println("Login Count(" + se.getSession().getAttribute("username") + ") : " + loginCnt);
		HttpSession session = se.getSession();
		ServletContext servletContext = session.getServletContext();
		WebApplicationContext appContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
		LoginManager loginManager = (LoginManager) appContext.getBean("loginManager");
		loginManager.sessionDestroyed(session);
	}

}
