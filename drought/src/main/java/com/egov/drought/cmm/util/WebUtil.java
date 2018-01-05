package com.egov.drought.cmm.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebUtil {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(WebUtil.class);
	
	static {
		System.setProperty("jsse.enableSNIExtension", "false");
	}
	
	
	public static String getResponseText(String urlString, String encoding) {
		return WebUtil.getResponseText(urlString, encoding, null, false, 0);
	}
	
	
	public static String getResponseText(String urlString, String encoding, Map<String, String> headers) {
		return WebUtil.getResponseText(urlString, encoding, headers, false, 0);
	}
	
	public static String getResponseText(String urlString, String encoding, Map<String, String> headers, boolean isSSLRequest) {
		return WebUtil.getResponseText(urlString, encoding, headers, isSSLRequest, 0);
	}
	
	public static String getDataServerResponseText(String urlString, String encoding, Map<String, String> headers) {
		if(headers == null) {
			headers = new HashMap<String, String>();
		}
		
		headers.put("sys_auth_key", "d392d5a6b962438b80e165b732c544fa");
		
		return WebUtil.getResponseText(urlString, encoding, headers, false, 0);
	}
	
	public static String getDataServerPost(String urlString, String encoding, Map<String, String> headers) {
		if(headers == null) {
			headers = new HashMap<String, String>();
		}
		
		headers.put("sys_auth_key", "d392d5a6b962438b80e165b732c544fa");
		
		return postResponseText(urlString, encoding, headers);
	}
	
	public static String postResponseText(String urlString, String encoding, Map<String, String> headers) {
		HttpURLConnection httpConnection = null;
		String[] url = urlString.split("\\?");
		String result = "";
		BufferedReader in = null;
		try{
			URL targetUrl = new URL(url[0]);
			httpConnection = (HttpURLConnection) targetUrl.openConnection();
			
			if(headers != null && !headers.isEmpty()) {
				Iterator<String> iterHeaderKey = headers.keySet().iterator();
				
				while(iterHeaderKey.hasNext()) {
					String key = iterHeaderKey.next();
					httpConnection.addRequestProperty(key, headers.get(key));
				}
			}
			
			httpConnection.setRequestMethod("POST");
			httpConnection.setDoOutput(true);
			OutputStream opstrm = httpConnection.getOutputStream();
			opstrm.write(url[1].getBytes());
			opstrm.flush();
			opstrm.close();
			
			String buffer = null;
			in = new BufferedReader(new InputStreamReader(httpConnection.getInputStream(), encoding));
			while((buffer = in.readLine()) != null) {
				result += buffer;
			}
		}catch(Exception e) {
			
		}finally {
			if(httpConnection != null) {
				try {
					httpConnection.disconnect();
				} catch(Exception e) {}
			}
			if(in != null) {
				try {
					in.close();
				} catch(Exception e) {}
			}
		}
		
		return result;
	}
	
	public static String getResponseText(String urlString, String encoding, Map<String, String> headers, boolean isSSLRequest, int timeout) { 
		HttpURLConnection httpConnection = null;
		InputStreamReader isr = null;
		BufferedReader br = null;
		
		StringBuffer result = new StringBuffer(); 
		
		try {
			URL url = new URL(urlString);
			httpConnection = (HttpURLConnection) url.openConnection();
			
			if(timeout > 0) {
				httpConnection.setConnectTimeout(timeout);
				httpConnection.setReadTimeout(timeout);
			}
			
			
			if(headers != null && !headers.isEmpty()) {
				Iterator<String> iterHeaderKey = headers.keySet().iterator();
				
				while(iterHeaderKey.hasNext()) {
					String key = iterHeaderKey.next();
					httpConnection.addRequestProperty(key, headers.get(key));
				}
			}
			
			
			isr = new InputStreamReader(httpConnection.getInputStream(), encoding);
			br = new BufferedReader(isr);
			
			String temp = null;
			
			while ((temp = br.readLine()) != null) {
				result.append(temp);
			}
			
			return result.toString();
		} catch(SocketTimeoutException ste) {
			LOGGER.debug("Read Time Exception : " + urlString);
			
		} catch(Exception e) {
			if(LOGGER.isErrorEnabled()) {
				LOGGER.error("exception", e);
			}
		} finally {
			if(br != null) {
				try {
					br.close();
				} catch(Exception e) {}
			}
			
			if(isr != null) {
				try {
					isr.close();
				} catch(Exception e) {}
			}
			
			if(httpConnection != null) {
				try {
					httpConnection.disconnect();
				} catch(Exception e) {}
			}
			
		}
		return null;
	}
	
	public static void getProxy(String type, String reqUrl, HttpServletRequest request, HttpServletResponse response) {
		HttpURLConnection httpURLConnection = null;
		InputStream is = null; 
		OutputStream os = null;
		InputStream ris = null; 
		OutputStream ros = null; 
		
		try {
			StringBuffer sbURL = new StringBuffer();
			sbURL.append(reqUrl);
			
			URL targetUrl = new URL(sbURL.toString());
			httpURLConnection = (HttpURLConnection)targetUrl.openConnection(); 
			httpURLConnection.setDoInput(true);
			
			if("GET".equals(type.toUpperCase())) {
				httpURLConnection.setDoOutput(false); 
				httpURLConnection.setRequestMethod("GET");
			}else{
				httpURLConnection.setDoOutput(true); 
				httpURLConnection.setRequestMethod("POST");
			}
			
			int length = 5000;
			int bytesRead = 0;
			ros = response.getOutputStream(); 
			response.setContentType(httpURLConnection.getContentType());
			ris = httpURLConnection.getInputStream();
			
			byte[] resBytes = new byte[length]; 
			bytesRead = 0; 
			while ((bytesRead = ris.read(resBytes, 0, length)) > 0) { 
				ros.write(resBytes, 0, bytesRead);
			}
		}catch(Exception e) { 
			LOGGER.debug("ERROR", e);
			response.setStatus(500); 
		} finally { 
			try { if(is != null) { is.close(); } } catch(Exception e) {} 
			try { if(os != null) { os.close(); } } catch(Exception e) {} 
			try { if(ris != null) { ris.close(); }  } catch(Exception e) {} 
			try { if(ros != null) { ros.close(); } } catch(Exception e) {} 
			if(httpURLConnection != null) { httpURLConnection.disconnect(); }
		}
	}
	
	public static void getProxyPost(String reqUrl, HttpServletRequest request, HttpServletResponse response) {
		HttpURLConnection httpURLConnection = null;
		InputStream is = null; 
		OutputStream os = null;
		InputStream ris = null; 
		OutputStream ros = null; 
		
		try {
			
			StringBuilder sbTargetURL = new StringBuilder();
			sbTargetURL.append(reqUrl);
			Enumeration<String> e = request.getParameterNames();
			
			StringBuffer param = new StringBuffer();
			
			while(e.hasMoreElements()){
				String paramKey = e.nextElement();
				param.append(paramKey+"="+(String)request.getParameter(paramKey)+"&");
			}
			
			String query = param.toString();
			
			query = query.substring(0, query.lastIndexOf("&"));
			URL targetUrl = new URL(sbTargetURL.toString());      
			httpURLConnection = (HttpURLConnection)targetUrl.openConnection(); 
			httpURLConnection.setDoInput(true);
			httpURLConnection.setDoOutput(true); 
			httpURLConnection.setRequestMethod("POST");
			is = new ByteArrayInputStream(query.getBytes("UTF-8"));
			
			os = httpURLConnection.getOutputStream(); 
			int length = 5000; 
			byte[] reqBytes = new byte[length]; 
			int bytesRead = 0; 
			while((bytesRead = is.read(reqBytes, 0, length)) > 0) { 
				os.write(reqBytes, 0, bytesRead);
			} 
			
			ros = response.getOutputStream(); 
			response.setContentType(httpURLConnection.getContentType());
			ris = httpURLConnection.getInputStream();
			
			byte[] resBytes = new byte[length]; 
			bytesRead = 0; 
			while ((bytesRead = ris.read(resBytes, 0, length)) > 0) { 
				ros.write(resBytes, 0, bytesRead); 
			}
		}catch(Exception e) { 
			LOGGER.debug("ERROR", e);
			response.setStatus(500); 
		} finally { 
			try { if(is != null) { is.close(); } } catch(Exception e) {} 
			try { if(os != null) { os.close(); } } catch(Exception e) {} 
			try { if(ris != null) { ris.close(); }  } catch(Exception e) {} 
			try { if(ros != null) { ros.close(); } } catch(Exception e) {} 
			if(httpURLConnection != null) { httpURLConnection.disconnect(); }
		}
	}
	
	public static void getProxyGet(String reqUrl, HttpServletRequest request, HttpServletResponse response) {
		HttpURLConnection httpURLConnection = null;
		InputStream is = null; 
		OutputStream os = null;
		InputStream ris = null; 
		OutputStream ros = null; 
		try {
			StringBuffer sbURL = new StringBuffer();
			sbURL.append(reqUrl);
			if(request.getQueryString() != null && !"".equals(request.getQueryString())){
				sbURL.append("?");
				sbURL.append(request.getQueryString());
			}
			
			URL targetUrl = new URL(sbURL.toString());
			httpURLConnection = (HttpURLConnection)targetUrl.openConnection(); 
			httpURLConnection.setDoInput(true);
			httpURLConnection.setDoOutput(false); 
			httpURLConnection.setRequestMethod("GET");
			
			int length = 5000;
			int bytesRead = 0;
			ros = response.getOutputStream(); 
			response.setContentType(httpURLConnection.getContentType());
			ris = httpURLConnection.getInputStream();
			
			byte[] resBytes = new byte[length]; 
			bytesRead = 0; 
			while ((bytesRead = ris.read(resBytes, 0, length)) > 0) { 
				ros.write(resBytes, 0, bytesRead);
			}
		}catch(Exception e) { 
			LOGGER.debug("ERROR", e);
			response.setStatus(500); 
		} finally { 
			try { if(is != null) { is.close(); } } catch(Exception e) {} 
			try { if(os != null) { os.close(); } } catch(Exception e) {} 
			try { if(ris != null) { ris.close(); }  } catch(Exception e) {} 
			try { if(ros != null) { ros.close(); } } catch(Exception e) {} 
			if(httpURLConnection != null) { httpURLConnection.disconnect(); }
		}
	}
	
	public static String getRandomPassword(int length){
		int index = 0;
		char[] charSet = new char[]{'0','1','2','3','4','5','6','7','8','9',
				'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
				'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'				
		};
		StringBuffer sb = new StringBuffer();
		for(int i = 0; i < length; i++) {
			
			double randomValue = Math.random();
			
			index = (int)(charSet.length * randomValue);
			sb.append(charSet[index]);
		}
		return sb.toString();
	}

}
