package com.notepad.notepad_backend.service;

import com.notepad.notepad_backend.model.Nota;
import com.notepad.notepad_backend.model.Pasta;
import com.notepad.notepad_backend.repository.NotaRepository;
import com.notepad.notepad_backend.repository.PastaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importante para operações complexas

import java.util.List;
import java.util.Optional;

@Service
public class NotaService {
    
    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private PastaRepository pastaRepository;

    //Criar ou atualizar uma nota
    @Transactional
    public Nota salvar(Nota nota) {
        return notaRepository.save(nota);
    }

    //Listar todas as notas
    public List<Nota> listarTodas() {
        return notaRepository.findAll();
    }

    //Buscar nota por ID
    public Optional<Nota> buscarPorId(Long id) {
        return notaRepository.findById(id);
    }

    //Deletar nota por ID
    public void deletar(Long id) {
        notaRepository.deleteById(id);
    }

    //método mestre-detalhe: Listar notas de uma pasta específica
    public List<Nota> listarNotasPorPasta(Long pastaId) {
        //1) busca a pasta para garantir que ela exista
        Pasta pasta = pastaRepository.findById(pastaId)
            .orElseThrow(() -> new RuntimeException("Pasta não encontrada com o id: " + pastaId));

        //2)acessar a lista de notas diretamente da entidade Pasta
        return pasta.getNotas();
    }

    //método mestre-detalhe: Listar notas de uma tag específica
    public List<Nota> listarNotasPorTag(Long tagId) {
        // busca Notas associadas à Tag com o ID fornecido (via relacionamento Many-to-Many).
        List<Nota> notas = notaRepository.findByTagsId(tagId);
        
        if (notas.isEmpty() && !notaRepository.existsById(tagId)) { 
             // Se nenhuma nota for encontrada E a tag realmente não existir, lança uma exceção.
        }

        return notas;
    }
}
