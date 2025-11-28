package com.notepad.notepad_backend.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // --- Relacionamento N:M com Nota ---
    @ManyToMany(mappedBy = "tags")
    @JsonIgnore
    private Set<Nota> notas = new HashSet<>();

    // CONSTRUTOR SEM ARGUMENTOS 
    public Tag() {
    }

    // CONSTRUTOR COM TODOS ARGUMENTOS 
    public Tag(Long id, String nome, Set<Nota> notas) {
        this.id = id;
        this.nome = nome;
        this.notas = notas;
    }

    // --- GETTERS E SETTERS ---

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

    public Set<Nota> getNotas() {
        return notas;
    }

    public void setNotas(Set<Nota> notas) {
        this.notas = notas;
    }
}
