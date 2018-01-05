package com.egov.drought.cmm.dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.dao.support.DaoSupport;
import org.springframework.util.Assert;

/**
 * DAO 기본 인터페이스 <br>
 * <br/>
 * 
<pre>
각 프로젝트에서 명시적으로 빈 등록 필요함
(org.mybatis.spring.SqlSessionFactoryBean 선언 필요) 

<bean name="commonDAO" class="com.enjoybt.common.dao.CommonDAO">
	<property name="sqlSessionFactory" ref="sqlSessionFactory"/>
</bean>
</pre>
 * 
 * 
 * @author 5seunguk
 * @since 2013. 4. 8.
 * @version 1.0
 *
 * <pre>
 * <<    수  정  사  항         >>
 *  수정일                          수정자                       수정내용
 *  -----------    ----------    ----------------------------------
 *  2013. 4. 8.    5seunguk      최초작성
 * </pre><br/>
 *
 */
public class CommonDAO extends DaoSupport {
	
	private SqlSession sqlSession;
	
	private SqlSession sqlBatchSession;

    private boolean externalSqlSession;
    
    private boolean externalSqlBatchSession;

    public final void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        if (!this.externalSqlSession) {
            this.sqlSession = new SqlSessionTemplate(sqlSessionFactory);
        }
    }
    
    public final void setSqlBatchSessionFactory(SqlSessionFactory sqlBatchSessionFactory) {
        if (!this.externalSqlBatchSession) {
            this.sqlBatchSession = new SqlSessionTemplate(sqlBatchSessionFactory);
        }
    }

    public final void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
        this.sqlSession = sqlSessionTemplate;
        this.externalSqlSession = true;
    }
    
    public final void setSqlBatchSessionTemplate(SqlSessionTemplate sqlBatchSessionTemplte) {
    	this.sqlBatchSession = sqlBatchSessionTemplte;
    	this.externalSqlBatchSession = true;
    }

    public final SqlSession getSqlSession() {
        return this.sqlSession;
    }
    
    public final SqlSession getSqlBatchSession() {
    	return this.sqlBatchSession;
    }

    protected void checkDaoConfig() {
        Assert.notNull(this.sqlSession, "Property 'sqlSessionFactory' or 'sqlSessionTemplate' are required");
    }
    
    
    public Object selectObject(String mapperId) throws SQLException {
		return this.sqlSession.selectOne(mapperId);
	}
	
	public Object selectObject(String mapperId, Object parameter) throws SQLException {
		return this.sqlSession.selectOne(mapperId, parameter);
	}

	
	@SuppressWarnings("unchecked")
	public Map<String, Object> selectMap(String mapperId) throws SQLException {
		return (Map<String, Object>)this.sqlSession.selectOne(mapperId);
	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> selectMap(String mapperId, Object parameter) throws SQLException {
		return (Map<String, Object>)this.sqlSession.selectOne(mapperId, parameter);
	}
	
	
	@SuppressWarnings("rawtypes")
	public List selectList(String mapperId) throws SQLException {
		return this.sqlSession.selectList(mapperId);
	}
	
	@SuppressWarnings("rawtypes")
	public List selectList(String mapperId, Object parameter) throws SQLException {
		return this.sqlSession.selectList(mapperId, parameter);
	}
	
	public int insert(String mapperId) throws SQLException {
		return this.sqlSession.insert(mapperId);
	}
	
	public int insert(String mapperId, Object parameter) throws SQLException {
		return this.sqlSession.insert(mapperId, parameter);
	}
	
	public int insertBatch(String mapperId, List<Object> paramList) throws SQLException {
		int output = 0;
		for(Object parameter : paramList) {
			output = this.sqlBatchSession.insert(mapperId, parameter);
		}
		return output;
	}
	
	public int update(String mapperId) throws SQLException {
		return this.sqlSession.update(mapperId);
	}
	
	public int update(String mapperId, Object parameter) throws SQLException {
		return this.sqlSession.update(mapperId, parameter);
	}
	
	public int updateBatch(String mapperId, List<Object> paramList) throws SQLException {
		int output = 0;
		for(Object parameter : paramList) {
			output = this.sqlBatchSession.update(mapperId, parameter);
		}
		return output;
	}
	
	public int delete(String mapperId) throws SQLException {
		return this.sqlSession.delete(mapperId);
	}
	
	public int delete(String mapperId, Object parameter) throws SQLException {
		return this.sqlSession.delete(mapperId, parameter);
	}
	
	
	
	
}
