<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<meta name="_csrf" content="${_csrf.token}"/>
<meta name="_csrf_header" content="${_csrf.headerName}"/>
<script type="text/javascript" src="<c:url value="/resources/js/lib/jquery/jquery-3.1.0.js" />" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/lib/rsa/jsbn.js" />" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/lib/rsa/rsa.js" />" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/lib/rsa/prng4.js" />" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/lib/rsa/rng.js" />" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/jbt/component/Common.js" />" charset="utf-8"></script>
<script type="text/javascript" src="<c:url value="/resources/js/jbt/component/Ajax.js" />" charset="utf-8"></script>

<script type="text/javascript">
	var _contextPath = '<c:url value="/"/>';
	
	var ajax = new Ajax({
		contextPath : _contextPath,
		callCount : 5
	});

	jQuery("window").ready(function() {
		jQuery("#form").submit(function() {
			var id = jQuery("#userID").val();
			var password = jQuery("#pass").val();
			
			if(id.isBlank()) {
				alert("아이디를 입력하세요.");
				jQuery("#userID").focus();
				return false;
			}
			
			if(password.isBlank()) {
				alert("패스워드를 입력하세요.");
				jQuery("#pass").focus();
				return false;
			}
			
			try{
				var rsa = new RSAKey();
				var publicModulus = "";
				var publicExponent = "";
				ajax.call("login/getPasswordEncoder.do", "POST", null, false, function(data) {
					publicModulus = data.publicM;
					publicExponent = data.publicE;
				});
				
				rsa.setPublic(publicModulus, publicExponent);
				
				jQuery("INPUT[name=password]").val(rsa.encrypt(password));
				
			}catch(e) {
				console.log(e);
				return false;
			}
			
			return true;
		});
	});
</script>
</head>
<body>
	<form  id="form" name="form" action="<c:url value="/login/loginProcess.do"/>" method="post" autocomplete="off">
		<div class="login_title">
					<div style="font-size:43px; font-weight:bold; font-family:verdana; color:#FFFFFF; font-style:italic; cursor:pointer; line-height:44px;">GEO BOARD</div>
					<div style="font-size: 11px; position: absolute; right: 3px; margin-top: 0px; color: white; font-weight: bold;">Ver 3.0</div><!-- color: #1C5086; -->
				</div>
				<table style="border: 0">
					<tr>
						<td>Login</td>
					</tr>
					<tr>
						<%--<th style="text-align: right; padding-right: 10px;">ID :</th>--%>
						<td><input type="text" name="userID" id="userID" class="textbox id" autofocus="autofocus" maxlength="50"/></td>
					</tr>
					<tr>
						<%-- <th style="text-align: right; padding-right: 10px;">Password :</th>--%>
						<td>
							<input type="password" id="pass" name="pass" class="textbox pw" maxlength="50">
							<input type="hidden" name="password">
							<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
						</td>
					</tr>
					<tr>
						<td colspan="2" align="right">
							<!-- <input type="button" value="계정생성요청" onclick="fnUserCreateReq();return false;" class="bt_log request"/> -->	
							<input type="submit" value="Login" id="submit"/>
						</td>
					</tr>
					<tr></tr>
					<tr>
						<td style="font-size: 11px;">
							※ 팝업 차단시 시스템이 정상적으로 동작하지 않을 수 있습니다.<br/>
							※ 듀얼 모니터(확장모드)를 사용하는 경우 팝업창의 정상적으로 위치하지 않을 수 있습니다.
						</td>
					</tr>
				</table>
	</form>
</body>
</html>