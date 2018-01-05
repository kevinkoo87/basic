package com.egov.drought.security;

import java.security.PrivateKey;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.egov.drought.security.util.RSAGenerator;

public class CustomUserNamePassword extends UsernamePasswordAuthenticationFilter {
	
	@Override
	protected String obtainPassword(HttpServletRequest request) {
		String realPass = "";
		String password = "";
		try {
				password = request.getParameter(SPRING_SECURITY_FORM_PASSWORD_KEY);
				System.out.println("Custom Password : " + password);
				PrivateKey privateKey = RSAGenerator.getPrivateKey(request.getSession());
				realPass = RSAGenerator.getValue(privateKey, password);
		}catch(Exception e) {
				e.printStackTrace();
		}
		
		if(realPass == null) {
			realPass = password;
		}
		System.out.println("Custom Output Password : " + realPass);
		return realPass;
	}
	
}
