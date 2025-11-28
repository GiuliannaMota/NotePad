package com.notepad.dto;

public class TagResponse {
    private Long id;
    private String nome;

    public TagResponse(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
