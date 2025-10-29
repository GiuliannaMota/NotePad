package com.notepad.notepad_backend.service;

import com.notepad.notepad_backend.model.Tag;
import com.notepad.notepad_backend.model.Tag;
import com.notepad.notepad_backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TagService {
    
        @Autowired
    private TagRepository tagRepository;

    //Criar ou atualizar uma pasta
    public Tag salvar(Tag tag) {
        return tagRepository.save(tag);
    }

    //Listar todas as pastas
    public List<Tag> listarTodas() {
        return tagRepository.findAll();
    }

    //Listar uma pasta por ID
    public Optional<Tag> buscarPorId(Long id) {
        return tagRepository.findById(id);
    }

    //Deletar uma pasta por ID
    public void deletar (Long id) {
        tagRepository.deleteById(id);
    }
}
