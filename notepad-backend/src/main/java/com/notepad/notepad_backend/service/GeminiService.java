package com.notepad.notepad_backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class GeminiService {

    private final RestClient geminiRestClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash-lite}")
    private String model;

    public GeminiService(RestClient geminiRestClient) {
        this.geminiRestClient = geminiRestClient;
    }

    public String gerarResumo(String titulo, String conteudo) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Chave da Gemini API não configurada."
            );
        }

        String prompt = criarPrompt(titulo, conteudo);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "maxOutputTokens", 220
                )
        );

        JsonNode response = geminiRestClient
                .post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model)
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        String resumo = extrairTexto(response);

        if (resumo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "A IA não retornou um resumo válido."
            );
        }

        return resumo.trim();
    }

    private String criarPrompt(String titulo, String conteudo) {
        return """
                Você é um assistente acadêmico dentro de um aplicativo de notas.

                Gere um resumo curto, claro e objetivo da nota abaixo.

                Regras:
                - Responda em português do Brasil.
                - Use no máximo 5 linhas.
                - Não invente informações.
                - Mantenha apenas as ideias principais.
                - Não use markdown.

                Título da nota:
                %s

                Conteúdo da nota:
                %s
                """.formatted(titulo, conteudo);
    }

    private String extrairTexto(JsonNode response) {
        if (response == null) {
            return "";
        }

        return response
                .path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText("");
    }
}