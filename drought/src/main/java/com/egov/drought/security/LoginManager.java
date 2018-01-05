package com.egov.drought.security;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.egov.drought.cmm.dao.CommonDAO;
import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;

public class LoginManager {
	
	private final Logger logger = LoggerFactory.getLogger(LoginManager.class);
	
	
	/** 세션 리스트 */
	private BiMap<String, HttpSession> sessionList = HashBiMap.create();
	
	/**
	 * 공통
	 * */
	private CommonDAO mainDAO;
	
	public void setMainDAO(CommonDAO mainDAO) {
		this.mainDAO = mainDAO;
	}

	/**
	* 로그인 사용자 등록
	* @param username - 사용자 아이디
	* @param session - 세션 객체
	* @return 등록 여부
	*/
	public boolean setSession(String username, HttpSession session) {
		HttpSession ses = (HttpSession)sessionList.get(username);
		if(ses != null && ses.getId() != session.getId()) {
			return false;
		}

		if (checkSession(session)) {
			sessionDestroyed(session);
		}

		session.setMaxInactiveInterval(60 * 30);// 60*30
		session.setAttribute("username", username);
		sessionList.put(username, session);
		checkSessionList("SetSession");
		return true;
	}
	
	/**
	* 로그인 사용자 목록 조회
	* @return 로그인 사용자 목록
	*/
	public List<Map<String, Object>> getSessionList() {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		
		for(String key : sessionList.keySet()) {
			Map<String, Object> data = new HashMap<String, Object>();
			data.put("Key", key);
			data.put("Session", sessionList.get(key).getId());
			result.add(data);
		}
		
		return result;
	}
	
	private void checkSessionList(String method) {
		System.out.println("Session List Id : " + this.hashCode());
		for (String username : sessionList.keySet()) {
			System.out.println("#################### " + method
					+ " Session List #######################                   " + username
					+ " : " + sessionList.get(username).getId());
		}
	}

	/**
	* 로그인 여부 체크
	* @param session - 세션 객체
	* @return 로그인 여부
	*/
	public boolean checkSession(HttpSession session) {
		for(String username : sessionList.keySet()){
			HttpSession ses = sessionList.get(username);
			if(ses.getId() == session.getId()){
				return true;
			}
		}
		return false;
	}
	
	public boolean checkSession(String username) {
		for(String usr : sessionList.keySet()){
			if(username.equals(usr)) {
				return true;
			}
		}
		return false;
	}
	
	/**
	* 로그인 여부 체크
	* @param username - 사용자 아이디
	* @param session - 세션 객체
	* @return 로그인 여부 (0 = 로그인은 되어있으나 세션이 다름(다른사람이 로그인 함). 1 = 로그인이 되어있고 세션도 동일함(본인이 로그인 함). -1 = 로그인이 되어있지 않음) 
	*/
	public Integer checkSession(String username, HttpSession session) {
		checkSessionList("CheckSession");
		HttpSession ses = sessionList.get(username);
		Integer cnt = 0;
		if (ses != null)
			System.out.println(username + " ==> " + ses.getId() + " : " + session.getId());
		else
			System.out.println(username + " : " + session.getId());
		if(ses == null) {
			cnt = -1;
		}else if(ses.getId() == session.getId()){
			cnt = 1;
		}
		return cnt;
	}
	
	/**
	* 사용자 세션 갱신
	* @param username - 사용자 아이디
	* @param session - 세션 객체
	*/
	public void resetSession(String username, HttpSession session) {
		if(sessionList.get(username).getId() != session.getId()) {
			try{
				sessionList.get(username).removeAttribute("username");
				sessionList.remove(username);
				sessionList.inverse().remove(session);
			}catch(Exception e) {}
		}
		session.setAttribute("username", username);
		sessionList.put(username, session);
		checkSessionList("ResetSession");
	}
	
	public void sessionDestroyed(HttpSession session) {
		checkSessionList("SessionDestroyed");
		sessionList.inverse().remove(session);
		checkSessionList("SessionDestroyed");
	}

}
