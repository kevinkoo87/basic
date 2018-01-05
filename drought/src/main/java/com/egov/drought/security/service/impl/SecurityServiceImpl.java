package com.egov.drought.security.service.impl;

import java.sql.SQLException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.egov.drought.cmm.dao.CommonDAO;
import com.egov.drought.security.service.SecurityService;

@Service
@SuppressWarnings("unchecked")
public class SecurityServiceImpl implements SecurityService {

	@Autowired
	private CommonDAO mainDAO;
	
	@Override
	public Map<String, Object> selectUserInfo(String username) throws SQLException {
		return (Map<String, Object>)mainDAO.selectObject("main.security.selectUserInfo", username);
	}

}
