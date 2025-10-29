package com.notepad.notepad_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pasta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // --- Relacionamento 1:N com Nota ---
    @OneToMany(
        mappedBy = "pasta",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Nota> notas = new ArrayList<>();
}
