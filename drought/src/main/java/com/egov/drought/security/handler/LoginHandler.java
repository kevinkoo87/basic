package com.egov.drought.security.handler;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.egov.drought.cmm.Constants;
import com.egov.drought.cmm.dao.CommonDAO;
import com.egov.drought.cmm.util.EgovBasicLogger;
import com.egov.drought.security.LoginManager;
import com.egov.drought.security.util.UserUtil;
import com.egov.drought.security.vo.UserVO;

/**
 * @author JBT
 *
 */
public class LoginHandler implements AuthenticationSuccessHandler, AuthenticationFailureHandler, UserDetailsService, AuthenticationManager  {

	private PasswordEncoder encoder = new BCryptPasswordEncoder();
	
	private CommonDAO mainDAO;
	
	private LoginManager loginMananger;
	
	@Value("#{config['MAIN_PAGE']}")
	private String mainPage;
	
	public void setMainDAO(final CommonDAO mainDAO) {
		this.mainDAO = mainDAO;
	}

	public void setLoginMananger(final LoginManager loginMananger) {
		this.loginMananger = loginMananger;
	}

	/**
	 * 2. 로그인 요청 사용자 계정에 대한 정보를 가져오는 메서드
	 * @param username
	 * @return
	 * @throws UsernameNotFoundException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		String logVal = "into Login Data " + username;
		EgovBasicLogger.debug(logVal);
		List<GrantedAuthority> authenticate = new ArrayList<GrantedAuthority>();
		UserVO user = null;
		try{
			Map<String, Object> userInfo = (Map<String, Object>)mainDAO.selectObject("main.security.selectUserInfo", username);
			if(userInfo == null || !userInfo.containsKey("usr_id")) {
				user = null;
			}else{
				String rule = (String)userInfo.get("auth");
				String userId = (String)userInfo.get("usr_id");
				String pw = (String)userInfo.get("passwd");
				authenticate.add(new SimpleGrantedAuthority("ROLE_"+rule));
				user = new UserVO(userId, pw, authenticate);
			}
		}catch(SQLException e) {
			EgovBasicLogger.debug("LoginHandler.loadUserByUsername Error", e);
		}
		return user;
	}

	/**
	 * 1. 로그인 사옹자 검증하는 메서드
	 * @param authentication
	 * @return
	 * @throws AuthenticationException
	 */
	@Override
	public Authentication authenticate(final Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String pwd = (String) authentication.getCredentials();
        UserDetails user;
        Collection<? extends GrantedAuthority> authorities;

        user = this.loadUserByUsername(username);
        if(user == null) {
        	throw new UsernameNotFoundException(Constants.LOGIN_FAILURE_NO_USER + ":" + username);
        }
        if(!encoder.matches(pwd, user.getPassword()))  throw new BadCredentialsException(Constants.LOGIN_FAILURE_NO_MATCH_PASSWORD);
        authorities = user.getAuthorities();
        
        return new UsernamePasswordAuthenticationToken(user, pwd, authorities);
	}
	
	/**
	 * 	3-1. 로그인 성공시 리턴되는 메서드
	 * @param request
	 * @param response
	 * @param authentication
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void onAuthenticationSuccess(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws IOException, ServletException {
		
		final String username = UserUtil.getUsername();
		HttpSession session = request.getSession();
		session.setAttribute("username", username);
		
		int sessionCode = loginMananger.checkSession(username, session);
		
		String redirectUrl = "";
		
		switch (sessionCode) {
			case 0 :		//로그인은 되어있으나 세션이 다름(다른사람이 로그인 함)
				redirectUrl = "/login/loginFail.do?error=" + Constants.SESSION_ANOTHER;
				break;
			case 1 :		//로그인이 되어있고 세션도 동일함(본인이 로그인 함)
				redirectUrl = mainPage;
				loginMananger.setSession(username, session);
				break;
			case -1 :		//로그인이 되어있지 않음
				redirectUrl = mainPage;
				loginMananger.setSession(username, session);
				break;
			default :
		}
		
		response.sendRedirect(request.getContextPath() +  redirectUrl);
	}

	/**
	 *  3-2. 로그인 실패시 리턴되는 메서드
	 * @param request
	 * @param response
	 * @param exception
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void onAuthenticationFailure(final HttpServletRequest request, final HttpServletResponse response, final AuthenticationException exception)
			throws IOException, ServletException {
		String logValue = "into Login Fail : " + exception.getMessage();
		EgovBasicLogger.debug(logValue);
		String errMsg = exception.getMessage();
		
		StringBuffer reqUrl = new StringBuffer(19);
		reqUrl.append(request.getContextPath());
		reqUrl.append( "/login/loginFail.do");
		
		
		if(errMsg.indexOf(Constants.LOGIN_FAILURE_NO_USER) != -1) {
			reqUrl.append( "?error=");
			reqUrl.append( Constants.LOGIN_FAILURE_NO_USER);
		}else if(errMsg.indexOf(Constants.LOGIN_FAILURE_NO_MATCH_PASSWORD) != -1) {
			reqUrl.append( "?error=");
			reqUrl.append( errMsg);
		}
		
		response.sendRedirect(reqUrl.toString());
	}
}
