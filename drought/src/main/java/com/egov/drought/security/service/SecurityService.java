package com.egov.drought.security.service;

import java.sql.SQLException;
import java.util.Map;

public interface SecurityService {
	public Map<String, Object> selectUserInfo(String username) throws SQLException;
}
