package com.notepad.notepad_backend.repository;

import com.notepad.notepad_backend.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
    
    List<Nota> findByTagsId(Long tagId);

    List<Nota> findByPastaId(Long pastaId);
}
