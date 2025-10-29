package com.notepad.notepad_backend.repository;

import com.notepad.notepad_backend.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
    
    // 🆕 NOVO MÉTODO: Query derivado para buscar Notas que contenham uma Tag específica
    // Assume que a classe Nota tem uma coleção chamada 'tags' (ex: Set<Tag> tags)
    List<Nota> findByTagsId(Long tagId);
}
