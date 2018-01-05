package com.egov.drought.cmm.service.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.egov.drought.cmm.dao.CommonDAO;
import com.egov.drought.cmm.service.CommonService;

@Service
public class CommonServiceImpl implements CommonService {
	
	@Autowired
	private CommonDAO mainDAO;
	
	@Override
	public void insertTestBatch() throws SQLException {
		Date sdt = new Date();
		List<Object> batchList = new ArrayList<Object>();
		for(int i=0; i<1000000; i++) {
			Map<String, Object> batchData = new HashMap<String, Object>();
			batchData.put("id", i);
//			char a = 65;
//			a+=i;
//			batchData.put("data", a);
			batchData.put("data", "aaaaaaaaa");
			batchList.add(batchData);
//			mainDAO.insert("main.sample.insertBatchTest", batchData);
		}
		mainDAO.insertBatch("main.batch.sample.insertBatchTest", batchList);
		Date edt = new Date();
		
		System.out.println("Insert Data Time : " + (edt.getTime() - sdt.getTime()) + "ms");
	}

}
