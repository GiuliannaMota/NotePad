package com.notepad.notepad_backend.repository;

import com.notepad.notepad_backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long>{
    
}
