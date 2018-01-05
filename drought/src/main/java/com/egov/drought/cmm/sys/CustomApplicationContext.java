package com.egov.drought.cmm.sys;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import com.egov.drought.cmm.annotation.TriggerMethod;
import com.egov.drought.cmm.annotation.WebSocketMethod;

@Component
public class CustomApplicationContext implements ApplicationContextAware {

	private  ApplicationContext context;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CustomApplicationContext.class);
	
	private final String BEAN_CLASS = "beanClass";
	
	private final String BEAN_METHOD = "beanMethod";
	
	private final Map<String, Map<String, Object>> annotationList;
	
	private final Map<String, Map<String, Object>> websocketMethodList;
	
	public CustomApplicationContext() {
		annotationList = new HashMap<String, Map<String, Object>>();
		websocketMethodList = new HashMap<String, Map<String, Object>>();
	}
	
	@PostConstruct
	public void init() {
		try{
			for(String beanName : context.getBeanDefinitionNames()) {
				for(Method m : AopUtils.getTargetClass(context.getBean(beanName)).getDeclaredMethods()) {
					if(m.isAnnotationPresent(TriggerMethod.class)) {
						TriggerMethod sl = m.getAnnotation(TriggerMethod.class);
						
						String name = sl.name();
						
						String type = sl.type();
						
						if(!annotationList.containsKey(type)) {
							annotationList.put(type, new HashMap<String, Object>());
						}
						
						Map<String, Object> contentList = annotationList.get(type);
						
						if(!contentList.containsKey(name)) {
							Map<String, Object> data = new HashMap<String, Object>();
							data.put(BEAN_CLASS, context.getBean(beanName));
							data.put(BEAN_METHOD, m);
							
							contentList.put(name, data);
						}else{
							LOGGER.error("Content Key overlap : " + name);
						}
					}else if(m.isAnnotationPresent(WebSocketMethod.class)) {
						WebSocketMethod sl = m.getAnnotation(WebSocketMethod.class);
						String path = sl.path();
						
						if(!websocketMethodList.containsKey(path)) {
							Map<String, Object> data = new HashMap<String, Object>();
							data.put(BEAN_CLASS, context.getBean(beanName));
							data.put(BEAN_METHOD, m);
							
							websocketMethodList.put(path, data);
						}
					}
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void setApplicationContext(ApplicationContext context) throws BeansException {
		this.context = context;
	}
	
	public Object getBean(String beanName) {
		Object obj = null;
		
		try{
			obj = context.getBean(beanName);
		}catch(Exception e) {
			obj = null;
		}
		
		return obj;
	}
	
	public <T> T getBean(String beanName, Class<T> requiredType) {
		return context.getBean(beanName, requiredType);
	}
	
	public Map<String, Object> getTriggerMethod(String annoType) {
		return annotationList.get(annoType);
	}
	
	public Object websocketCallback(String path, Map<String, Object> params) {
		try{
			Map<String, Object> contentList = websocketMethodList.get(path);
			if(contentList != null) {
				Object beanClass = contentList.get(BEAN_CLASS);
				Method beanMethod = (Method) contentList.get(BEAN_METHOD);
				
				if(beanClass != null && beanMethod != null) {
					return beanMethod.invoke(beanClass, params);
				}
			}
		}catch(Exception e) {
			LOGGER.error("Trigger Method Error : ", e);
		}
		return null;
	}
	
	public Object triggerMethod(String annoType, String contentType, Object... params) {
		try{
			Map<String, Object> contentList = annotationList.get(annoType);
			
			if(contentList != null) {
				Map<String, Object> content = (Map<String, Object>)contentList.get(contentType);
			
				if(content != null) {
					Object beanClass = content.get(BEAN_CLASS);
					Method beanMethod = (Method) content.get(BEAN_METHOD);
				
					if(beanClass != null && beanMethod != null) {
						return beanMethod.invoke(beanClass, params);
					}
				}
			}
			
		}catch(Exception e) {
			LOGGER.error("Trigger Method Error : ", e);
		}
		
		return null;
	}
	
	public Map<String, Object> getBeanAndMethod(String beanName, String methodName) {
		try{
			for(Method m : AopUtils.getTargetClass(context.getBean(beanName)).getDeclaredMethods()) {
				if(m.getName().equals(methodName)) {
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("class", context.getBean(beanName));
					map.put("method", m);
					return map;
				}
			}
		}catch(Exception e) {
			LOGGER.error("getBeanAndMethod Error : ", e);
		}
		
		return null;
	}
	
}
