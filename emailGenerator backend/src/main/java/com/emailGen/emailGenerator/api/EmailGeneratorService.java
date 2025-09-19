package com.emailGen.emailGenerator.api;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Objects;

@Service
public class EmailGeneratorService {
    private final WebClient webClient;
    @Value("${gemini_api_url}")
    private String geminiApiUrl;
    @Value("${gemini_api_key}")
   private String getGeminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest request){
      //build the prompt
       String prompt = buildPrompt(request);
       //craft a request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );
        // do request and get the response;
        String response = webClient.post()
                .uri(geminiApiUrl + getGeminiApiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        //extract response and return response
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error When Processing Request"+e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest request) {
    StringBuilder prompt =  new StringBuilder();
    prompt.append("Generate the professional email reply for the" +
            " following email. and please dont generate the subject" +
            " line");
    if(request.getTone() != null && !request.getTone().isEmpty()){
        prompt.append("Use a").append(request.getTone()).append("tone");
    }
    prompt.append("\n Original Email \n").append(request.getEmailContent());
    return prompt.toString();
    }
}
