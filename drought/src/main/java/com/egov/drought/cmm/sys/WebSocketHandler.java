package com.egov.drought.cmm.sys;

import java.util.Iterator;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.egov.drought.cmm.Constants;
import com.egov.drought.security.LoginManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;

public class WebSocketHandler extends TextWebSocketHandler{
	
	@Autowired
	private CustomApplicationContext context;
	
	@Autowired
	private LoginManager loginManager;
	
	private int annUsr;

	private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketHandler.class);
	//private List<WebSocketSession> sessionList = new ArrayList<WebSocketSession>();
	private BiMap<String, WebSocketSession> sessionList = HashBiMap.create();	
	private Map<String, Object> contents = null;
	
	public WebSocketHandler() {
		super();
	}
	
	@PostConstruct
	public void init() {
		LOGGER.info("Create SocketHandler Instance!");
		contents = context.getTriggerMethod(Constants.WEBSOCKET_RESPONSE_METHOD);
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		super.afterConnectionClosed(session, status);
		String username = "";
		if(sessionList.inverse().get(session) != null) {
			username = sessionList.inverse().get(session);
		}
		sessionList.inverse().remove(session);
		LOGGER.info("Remove Session :" + username + "("+session.getId()+")");
	}
	
	public void afterConnectionEstablished(WebSocketSession session) throws Exception{
		super.afterConnectionEstablished(session);
		//sessionList.add(session);
		LOGGER.info("add Session");
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		super.handleMessage(session, message);
		LOGGER.info("Receive Message : " + message.getPayload());
		try{
			if(message != null) {
				Map<String, Object> data = new ObjectMapper().readValue(message.getPayload().toString(), Map.class);
				String path = (String)data.get("_PATH");
				
				if("INIT".equals(path)) {
					String username = (String)data.get("VALUE");
					if (StringUtils.isEmpty(username)) {
						String usr = "usr_" + (annUsr++);
						this.sessionList.put(usr, session);
					} else if (loginManager.checkSession(username)) {
						this.sessionList.put(username, session);
					}
				}else{
					if(this.sessionList.inverse().get(session) != null) {
						context.websocketCallback(path, data);
					}
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@Override
	public boolean supportsPartialMessages() {
		LOGGER.info("Call Method");
		return super.supportsPartialMessages();
	}
	
	public void sendAllMessage(String key, String message) throws Exception{
		Iterator<String> keys = this.sessionList.keySet().iterator();
		while(keys.hasNext()) {
			String usrnm = keys.next();
			WebSocketSession session = this.sessionList.get(usrnm);
			this.message(session, key, message);
		}
	}
	
	private void message(WebSocketSession session, String key, String message) throws Exception {
		if(session.isOpen()) {
			session.sendMessage(new TextMessage(key + "<:>" + message));
		}
	}
	
	public void sendMessage(String username, String key, String message) throws Exception {
		Iterator<String> keys = this.sessionList.keySet().iterator();
		while(keys.hasNext()) {
			String usrnm = keys.next();
			if(username.equals(usrnm)) {
				WebSocketSession session = this.sessionList.get(usrnm);
				this.message(session, key, message);
			}
		}
	}
}
