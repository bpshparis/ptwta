package com.ekaly.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ekaly.tools.Tools;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.ToneAnalyzer;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneAnalysis;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneChatOptions;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneChatScore;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneInput;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneOptions;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.ToneScore;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.Utterance;
import com.ibm.watson.developer_cloud.tone_analyzer.v3.model.UtteranceAnalyses;

/**
 * Servlet implementation class GetImportedKeysServlet
 */
@WebServlet("/AAT")
public class AnalyzeAllToneServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AnalyzeAllToneServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings({ "unchecked" })
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Map<String, Object> result = new HashMap<String, Object>();

		result.put("SESSIONID", request.getSession().getId());		
		result.put("CLIENT", request.getRemoteAddr() + ":" + request.getRemotePort());
		result.put("SERVER", request.getLocalAddr() + ":" + request.getLocalPort());
		result.put("FROM", this.getServletName());
//		ObjectMapper mapper = new ObjectMapper();
//        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		
		try{

			Map<String, Object> parms = Tools.fromJSON(request.getInputStream());
	        
	        if(parms != null && parms.get("text") != null) {
	        	
		        	ToneAnalyzer ta = (ToneAnalyzer) request.getServletContext().getAttribute("ta");
		        	
		        	ToneOptions.Builder tob  = (ToneOptions.Builder) request.getServletContext().getAttribute("tob");
		        	ToneInput ti = new ToneInput.Builder(parms.get("text").toString()).build();
		        	ToneOptions to = tob.toneInput(ti).build();
		        	ToneAnalysis tAnalysis = ta.tone(to).execute();
		        	
	        		List<Map<String, Object>> historical = (List<Map<String, Object>>) request.getServletContext().getAttribute("historical");
		        	Map<String, Object> m = new HashMap<String, Object>();
		        	m.put("TEXT", parms.get("text"));
	        		Map<String, Double> tonesMap = new HashMap<String, Double>();
		        	
		        	if(tAnalysis != null) {
		        		List<ToneScore> tones = tAnalysis.getDocumentTone().getTones();
		        		
		        		if(tones != null) {
			        		for(ToneScore tone: tones) {
			        			tonesMap.put(tone.getToneId(), tone.getScore());
			        		}
		        		}
		        		
		        		result.put("STATUS", "OK");
			        	result.put("TEXT", ti.text());
		        		result.put("TONES", tonesMap);
		        		
		        	}
		        	else {
		        		result.put("ANSWER", "No valid ToneAnalysis object returned.");
		        	}
		        	
		        	ToneChatOptions.Builder tcob = (ToneChatOptions.Builder) request.getServletContext().getAttribute("tcob");
		        	
		        	List<Utterance> us = new ArrayList<Utterance>();
		        	us.add(new Utterance.Builder().text((String) parms.get("text")).build());
		        	
		        	ToneChatOptions tco = tcob
		        			.utterances(us)
		        			.build();

		        	UtteranceAnalyses uAnalysis = ta.toneChat(tco).execute();
		        	
		        	if(uAnalysis != null) {
		        		List<ToneChatScore> tones = uAnalysis.getUtterancesTone().get(0).getTones();
		        		
		        		if(tones != null) {
			        		for(ToneChatScore tone: tones) {
			        			tonesMap.put(tone.getToneId(), tone.getScore());
			        		}
		        		}

		        		result.put("STATUS", "OK");
			        	result.put("TEXT", parms.get("text"));
		        		result.put("TONES", tonesMap);
		        		
		        	}
		        	else {
		        		result.put("ANSWER", "No valid UtteranceAnalyses object returned.");
		        		throw new Exception();
		        	}
		        	
	        		m.put("TONES", tonesMap);
	        		historical.add(m);
	        		request.getServletContext().setAttribute("historical", historical);
		        	
	        }
	        else {
        		result.put("ANSWER", "No valid ToneInput object received.");
        		Map<String, Object> eg = new HashMap<String, Object>();
        		eg.put("text", "blablabla...");
        		result.put("E.G.", eg);
        		result.put("TROUBLESHOOTING", "Have a look at: http://watson-developer-cloud.github.io/java-sdk/docs/java-sdk-6.0.0/index.html?com/ibm/watson/developer_cloud/tone_analyzer/v3/package-summary.html");
        		throw new Exception();
	        }
	        
		}
		catch(Exception e){
			result.put("STATUS", "KO");
            result.put("EXCEPTION", e.getClass().getName());
            result.put("MESSAGE", e.getMessage());
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            result.put("STACKTRACE", sw.toString());
		}			
		
		finally {
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(Tools.toJSON(result));
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}

