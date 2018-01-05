package com.egov.drought.security.vo;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserVO implements UserDetails {
	
	private static final long serialVersionUID = -6286395747969948191L;
	
	/**
	 * 	사용자 계정
	 */
	private String userID;
	
	/**
	 *  사용자 패스워드 
	 */
	private String password;
	
	/**
	 *  그룹 코드 
	 */
	private String orgCode;
	
	/**
	 *  계정 권한 목록 
	 */
	private List<GrantedAuthority> authorities;
	
	/**
	 * 	계정이 만료되지 않았는지 여부
	 */
	private boolean isAccountNonExpired;
	
	/**
	 *  계정이 잠금해제되었는지 여부
	 */
	private boolean isAccountNonLocked;
	
	/**
	 *  자격 증명이 만료되지 않았는지 여부
	 */
	private boolean isCredentialsNonExpired;
	
	/**
	 *  활성화 되었는지 여부
	 */
	private boolean isEnabled;
	
	public UserVO(String userID, String password, List<GrantedAuthority> authorities) {
		this.userID = userID;
		this.password = password;
		this.authorities = authorities;
		this.isAccountNonExpired = true;
		this.isAccountNonLocked = true;
		this.isCredentialsNonExpired = true;
		this.isEnabled = true;
	}
	
	public UserVO(String userID, String password, List<GrantedAuthority> authorities, boolean isAccountNonExpired, boolean isAccountNonLocked, boolean isCredentialsNonExpired, boolean isEnabled) {
		this.userID = userID;
		this.password = password;
		this.authorities = authorities;
		this.isAccountNonExpired = isAccountNonExpired;
		this.isAccountNonLocked = isAccountNonLocked;
		this.isCredentialsNonExpired = isCredentialsNonExpired;
		this.isEnabled = isEnabled;
	}
	
	public void setAuthorities(GrantedAuthority authority){
		authorities.clear();
		authorities.add(authority);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return userID;
	}

	@Override
	public boolean isAccountNonExpired() {
		return isAccountNonExpired;
	}

	@Override
	public boolean isAccountNonLocked() {
		return isAccountNonLocked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return isCredentialsNonExpired;
	}

	@Override
	public boolean isEnabled() {
		return isEnabled;
	}

}
