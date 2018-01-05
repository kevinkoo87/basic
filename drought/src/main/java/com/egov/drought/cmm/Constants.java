package com.egov.drought.cmm;

public class Constants {
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//	Request Result에서 사용하는 상수
	//
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	/** 결과 키 */
	public final static String KEY_RESULT = "RESULT";
	/** 메시지 키 */
	public final static String KEY_MSG = "MSG";
	/** 리스트 키 */
	public final static String KEY_LIST = "LIST";
	/** 데이터 키 */
	public final static String KEY_DATA = "DATA";
	/** 개수 키 */
	public final static String KEY_COUNT = "COUNT";
	/** 페이지 키 */
	public final static String KEY_PAGE = "PAGE";
	/** 페이지 컬럼 키 */
	public final static String KEY_PAGE_ROW = "PAGEROW";
	/** 총 개수 키 */
	public final static String KEY_TOTAL_COUNT = "TOTAL_COUNT";
	/** 메뉴 권한 체크 키 */
	public final static String KEY_MENU_AUTH = "MENU_AUTH";
	
	
	/** 결과 - 성공 */
	public final static String VALUE_RESULT_SUCCESS = "SUCCESS";
	/** 결과 - 실패 */
	public final static String VALUE_RESULT_FAILURE = "FAILURE";
	/** 결과 - 파일 업로드 실패 */
	public final static String VALUE_RESULT_UPLOAD_FAILRUE = "UPLOAD_FAILRUE";
	/** 메세지 - 성공 */
	public final static String VALUE_MSG_SUCEESS = "SUCCESS";
	/** 메세지 - 실패 */
	public final static String VALUE_MSG_FAILURE = "FAILURE";
	/** 메세지 - 파일 사이즈 체크 */
	public final static String VALUE_MSG_UPLOAD_SIZE_CHECK = "UPLOAD_SIZE_CHECK";
	/** 메세지 - 파일 불허용  */
	public final static String VALUE_MSG_NOT_ALLOW_FILE_EXT = "UPLOAD_NOT_ALLOW_FILE_EXT";
	/** 메세지 - 잘못된 연결 */
	public final static String VALUE_MSG_WRONG_ACCESS = "WRONG_ACCESS";
	/** 메뉴 권한 - 성공 */
	public final static String VALUE_MENU_AUTH_SUCCESS = "SUCCESS";
	/** 메뉴 권한 - 실패 */
	public final static String VALUE_MENU_AUTH_FAILURE = "FAILURE";
	
	/** 사용자 권한 - 관리자 */
	public final static String ROLE_ADMIN = "ROLE_ADMIN";
	/** 사용자 권한 - 사용자 */
	public final static String ROLE_USER = "ROLE_USER";
	/** 사용자 권한 - 사이트 접근 제한자 */
	public final static String ROLE_FAILURE = "ROLE_FAILURE";
	/** 세션 - 다른 사람의 로그인 함 */
	public final static String SESSION_ANOTHER = "SESSION_ANOTHER";
	/** 세션 - 다른 사람이 로그인 하여 로그아웃 됨 */
	public final static String SESSION_ANOTHER_OUT = "SESSION_ANOTHER_OUT";
	/** 세션 - 세션이 종료되었음 */
	public final static String SESSION_DELETE = "SESSION_DELETE";
	/** 세션 - 접근이 제한된 요청 */
	public final static String ACCESS_FAULT = "ACCESS_FAULT";
	
	/** 로그인 - 사용자 정보 없음 */
	public final static String LOGIN_FAILURE_NO_USER = "NO_USER";
	/** 로그인 - 패스워드 틀림 */
	public final static String LOGIN_FAILURE_NO_PASSWORD = "NO_PASSWORD";
	
	public final static String LOGIN_FAILURE_NO_MATCH_PASSWORD = "NO_MATCH_PASSWORD";
	
	/** 로그인 - 미승인 사용자 */
	public final static String LOGIN_FAILURE_NO_ACCEPT = "NO_ACCEPT";	
	/** 사용자 비밀번호 변경주기(단위:일) */
	public final static int USER_PASSWORD_CHANGE_PRIOD = 180;	
	/** 삭제된 사용자 키*/
	public final static String DELETE_USER_KEY = "DELETE_USER";
	/** 삭제된 사용자 값*/
	public final static String DELETE_USER_VALUE = "삭제계정";
	
/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	알람 관련 상수들
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/** 알람 - 우측 하단 최대 보여줄 개수 */
	public final static int ALARM_MAX_COUNT = 3;
	
	
/////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 웹 소켓 관련 상수들
//
/////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/** WebSocket Port */
	public final static Integer WEBSOCKET_PORT = 9000;
	
	public final static String WEBSOCKET_RESPONSE_METHOD = "WBSCKT_RES_METHOD";
}
