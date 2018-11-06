package com.ekaly.test;

public class Main4 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
   		String vcap_services = System.getenv("VCAP_SERVICES");
		System.out.println("VCAP_SERVICES System ENV=" + vcap_services);
	}

}
