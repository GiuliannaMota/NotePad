package com.notepad.notepad_backend.repository;

import com.notepad.notepad_backend.model.Pasta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PastaRepository extends JpaRepository<Pasta, Long>{
    
}
