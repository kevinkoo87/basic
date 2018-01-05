<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta name="_csrf" content="${_csrf.token}"/>
<meta name="_csrf_header" content="${_csrf.headerName}"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="<c:url value='/resources/css/common.css'/>" rel="stylesheet" type="text/css" >
<style type="text/css">
	
</style>
<script type="text/javascript" src="<c:url value="/resources/js/jbt/config.js"/>"></script>
<script type="text/javascript" src="<c:url value="/resources/js/lib/jquery/jquery-3.1.0.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/resources/js/lib/jquery/noConflict.js"/>"  charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/jbt/component/Common.js"/>"></script>
<script type="text/javascript" src="<c:url value="/resources/js/jbt/component/Ajax.js" />"  charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/jbt/component/WebSocket.js"/>"></script>
<title>Insert title here</title>
<script type="text/javascript">
	var _contextPath = '<c:url value="/"/>';
	var websocket = null;
	var username = "${username}";

	jQuery(window).on("load", function() {
		console.log("window Load");
		websocket = new Socket({
			url : _contextPath + "websocket/",
			port : 9000,
			username : username
		})
	});
	
</script>
</head>
<body>

</body>
</html>