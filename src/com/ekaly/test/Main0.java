package com.ekaly.test;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.ekaly.tools.Cmd;
import com.ekaly.tools.Tools;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;

public class Main0 {

	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub
		
		Path path = Paths.get("/opt/wks/ekaly/WebContent/res/taKeyCmd.json");
		
		
//		Cmd cmd = mapper.readValue(new FileInputStream(path.toFile()), t);
		
		Cmd cmd = (Cmd) Tools.fromJSON(path.toFile(), new TypeReference<Cmd>() {});
		
		System.out.println(Tools.toJSON(cmd));
		
	}

}
