package com.egov.drought;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class CustomPassword {
	public static void main(String[] args) throws Exception {

		PasswordEncoder encoder = new BCryptPasswordEncoder();
		
		System.out.println(encoder.encode("0"));
	}
}
