package com.notepad.dto;

import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import com.notepad.notepad_backend.model.Nota;

public class NotaResponse {
    private Long id;
    private String titulo;
    private String conteudo;
    private Date dataCriacao;
    private PastaResponse pasta;
    private Set<TagResponse> tags;

    public NotaResponse(Nota nota) {
        this.id = nota.getId();
        this.titulo = nota.getTitulo();
        this.conteudo = nota.getConteudo();
        this.dataCriacao = nota.getDataCriacao();
        if (nota.getPasta() != null) {
            this.pasta = new PastaResponse(nota.getPasta().getId(), nota.getPasta().getNome());
        }
        this.tags = nota.getTags().stream()
                .map(tag -> new TagResponse(tag.getId(), tag.getNome()))
                .collect(Collectors.toSet());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Date getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(Date dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public PastaResponse getPasta() {
        return pasta;
    }

    public void setPasta(PastaResponse pasta) {
        this.pasta = pasta;
    }

    public Set<TagResponse> getTags() {
        return tags;
    }

    public void setTags(Set<TagResponse> tags) {
        this.tags = tags;
    }
}
