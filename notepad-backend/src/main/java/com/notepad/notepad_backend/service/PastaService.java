package com.notepad.notepad_backend.service;

import com.notepad.notepad_backend.model.Pasta;
import com.notepad.notepad_backend.repository.PastaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PastaService {
    
    @Autowired
    private PastaRepository pastaRepository;

    //Criar ou atualizar uma pasta
    public Pasta salvar(Pasta pasta) {
        return pastaRepository.save(pasta);
    }

    //Listar todas as pastas
    public List<Pasta> listarTodas() {
        return pastaRepository.findAll();
    }

    //Listar uma pasta por ID
    public Optional<Pasta> buscarPorId(Long id) {
        return pastaRepository.findById(id);
    }

    //Deletar uma pasta por ID
    public void deletar (Long id) {
        pastaRepository.deleteById(id);
    }
}
