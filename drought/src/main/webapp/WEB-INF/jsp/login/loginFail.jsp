<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<!DOCTYPE html>
<html>
<head>
	<title>Geo Board</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<%-- <link rel="stylesheet" href="<c:url value='/resources/css/common.css'/>" type="text/css" />
	<link rel="stylesheet" href="<c:url value='/resources/css/login/login.css'/>" type="text/css" /> --%>
<script type="text/javascript" src="<c:url value="/resources/js/lib/jquery/jquery-3.1.0.js" />" charset="utf-8"></script>
</head>
<body>
	<div style="position: absolute;">
		<div id="mainContainer">
			<c:choose>
				<c:when test="${RESULT eq 'NO_MATCH_PASSWORD' }">
					패스워드가 틀리셨습니다. &nbsp; 확인 후 다시 접속하시기 바랍니다.
				</c:when>
				<c:when test="${RESULT eq 'NO_USER' }">
					아이디가 틀리셨습니다. &nbsp; 확인 후 다시 접속하시기 바랍니다.
				</c:when>
				<c:when test="${RESULT eq 'NO_ACCEPT' }">
					아직 승인된 사용자가 아닙니다. &nbsp; 확인 후 다시 접속하시기 바랍니다.
				</c:when>		
				<c:when test="${RESULT eq 'SESSION_ANOTHER'}">
					다른사람이 로그인하였습니다. &nbsp;
					<div class="bt_log login" style="width:200px;font-size:13px;"><a href="<c:url value='/login/sessionLogin.do'/>">현재 계정으로 로그인</a></div>
				</c:when>		
				<c:otherwise>
					로그인에 실패하셨습니다. &nbsp; 확인 후 다시 접속하시기 바랍니다.
				</c:otherwise>
			</c:choose>
			<div class="bt_log login" style="width:200px;font-size:13px;"><a href="<c:url value='/login/login.do'/>">로그인 페이지로 이동</a></div>
		</div>
	</div>
</body>
</html>