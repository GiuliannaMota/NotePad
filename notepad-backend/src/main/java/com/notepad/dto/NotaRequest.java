package com.notepad.dto;

import java.util.List;

public class NotaRequest {
    
    private String titulo;
    private String conteudo;
    private Long pastaId;
    private List<Long> tagIds;

    public NotaRequest() { }

    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getConteudo() {
        return conteudo;
    }
    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public Long getPastaId() {
        return pastaId;
    }
    public void setPastaId(Long pastaId) {
        this.pastaId = pastaId;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }
    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }
}