package com.egov.drought.security.util;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import com.egov.drought.cmm.Constants;
import com.egov.drought.security.vo.UserVO;

/**
* Class Name : UserUtil
* Description : 사용자 정보 관리 클래스
* Modification Information
* 
* 수정일		수정자		수정내용
* ------- -------- ---------------------------
* 2014. 9. 17.	jackshy		최초 생성
*
* @author 스마트 재난/안전 플랫폼 – 사용자 정보 관리 클래스(jackshy)
* @since 2014. 9. 17.
* @version 1.0
* 
* Copyright (C) 2014 by MOSPA All right reserved.
*/
public class UserUtil {
	/**
	* 세션 사용자 객체 가져오는 메서드
	* @return 사용자 정보 객체
	*/
	public static UserVO getUserVO() {
		try{
			return (UserVO)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		}catch(Exception e) {
			return null;
		}
		
	}
	
	/**
	* 세션 사용자 권한 가져오는 메서드
	* @return 사용자 권한
	*/
	public static String getRole() {
		if(UserUtil.getUserVO() != null) {
			return UserUtil.getUserVO().getAuthorities().iterator().next().getAuthority();
		}else{
			return null;
		}
	}
	
	/**
	* 세션 사용자 관리자 권한인지 체크하는 메서드
	* @return 관리자 권한 여부
	*/
	public static boolean isAdmin() {
		String role = UserUtil.getRole();
		return role.equals(Constants.ROLE_ADMIN);
	}
	
	/**
	* 세션 사용자 접속 권한 없는 지 여부 확인
	* @return 접속 권한 여부
	*/
	public static boolean isFail() {
		String role = UserUtil.getRole();
		return role.equals(Constants.ROLE_FAILURE);
	}
	
	/**
	* 세션 사용자 아이디 가져오는 메서드
	* @return 사용자 아이디
	*/
	public static String getUsername() {
		if(UserUtil.getUserVO() != null) {
			return UserUtil.getUserVO().getUsername();
		}else{
			return null;
		}
		
	}
	
	/**
	* 세션 사용자 아이디 체크
	* @param check - 체크할 사용자 아이디
	* @return 동일 여부
	*/
	public static boolean checkUsername(String check) {
		String username = UserUtil.getUsername();
		
		return username.equals(check);
	}
	
	public static void setFailRole() {
		GrantedAuthority authorityFail = new SimpleGrantedAuthority(Constants.ROLE_FAILURE);
		UserUtil.getUserVO().setAuthorities(authorityFail);
	}
	
	public static void setRole(String role) {
		GrantedAuthority authorityFail = new SimpleGrantedAuthority(role);
		UserUtil.getUserVO().setAuthorities(authorityFail);
	}
}
