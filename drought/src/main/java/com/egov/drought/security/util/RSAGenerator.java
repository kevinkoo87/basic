package com.egov.drought.security.util;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;

import javax.crypto.Cipher;
import javax.servlet.http.HttpSession;

public class RSAGenerator {
	
	private static final int KEY_SIZE = 1024;
	private static final String RSA_KEY = "RSA_PK";
	private static final String KEY_TYPE = "RSA";
	
	public static String[] createRsaGenerator(HttpSession session) {
		String[] result = new String[2];
		
		KeyPairGenerator generator;
		KeyPair keyPair;
		KeyFactory keyFactory;
		PublicKey publicKey;
		PrivateKey privateKey;
		
		try {
			generator = KeyPairGenerator.getInstance(KEY_TYPE);
			generator.initialize(KEY_SIZE);
			
			keyPair = generator.genKeyPair();
			keyFactory = KeyFactory.getInstance(KEY_TYPE);
			
			publicKey = keyPair.getPublic();
			privateKey = keyPair.getPrivate();
			
			session.setAttribute(RSA_KEY, privateKey);
			
			RSAPublicKeySpec publicSpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
			
			String publicKeyModulus = publicSpec.getModulus().toString(16);
			String publicKeyExponent = publicSpec.getPublicExponent().toString(16);
			
			result[0] = publicKeyModulus;
			result[1] = publicKeyExponent;
			
		} catch (Exception e) {
			e.printStackTrace();
			result = null;
		}
		
		return result;
	}
	
	public static PrivateKey getPrivateKey(HttpSession session) {
		PrivateKey privateKey = null;
		
		try{
			
			privateKey = (PrivateKey)session.getAttribute(RSA_KEY);
			session.removeAttribute(RSA_KEY);
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return privateKey;
	}
	
	public static String getValue(PrivateKey privateKey, String str) {
		String result = "";
		
		try {
			
			Cipher cipher = Cipher.getInstance(KEY_TYPE);
			byte[] encryptedBytes = hexToByteArray(str);
			
			cipher.init(Cipher.DECRYPT_MODE, privateKey);
			
			byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
			
			result = new String(decryptedBytes, "utf-8");
			
		}catch(Exception e) {
			result = null;
		}
		
		return result;
	}
	
	public static byte[] hexToByteArray(String hex) {
		if (hex == null || hex.length() % 2 != 0) {
			return new byte[] {};
		}

		byte[] bytes = new byte[hex.length() / 2];
		for (int i = 0; i < hex.length(); i += 2) {
			byte value = (byte) Integer.parseInt(hex.substring(i, i + 2), 16);
			bytes[(int) Math.floor(i / 2)] = value;
		}
		return bytes;
	}
}
