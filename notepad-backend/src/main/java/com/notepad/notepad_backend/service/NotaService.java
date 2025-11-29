package com.notepad.notepad_backend.service;

import com.notepad.dto.NotaResponse;
import com.notepad.dto.NotaRequest;
import com.notepad.notepad_backend.model.Nota;
import com.notepad.notepad_backend.model.Pasta;
import com.notepad.notepad_backend.model.Tag;
import com.notepad.notepad_backend.repository.NotaRepository;
import com.notepad.notepad_backend.repository.PastaRepository;
import com.notepad.notepad_backend.repository.TagRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private PastaRepository pastaRepository;

    @Autowired
    private TagRepository tagRepository;


    //Criar ou atualizar uma nota
    @Transactional
    public Nota salvar(Nota nota) {
        return notaRepository.save(nota);
    }

    @Transactional
    public Nota salvar(NotaRequest notaRequest) {
        Nota nota = new Nota();
        nota.setTitulo(notaRequest.getTitulo());
        nota.setConteudo(notaRequest.getConteudo());

        if (notaRequest.getPastaId() != null) {
            Pasta pasta = pastaRepository.findById(notaRequest.getPastaId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pasta não encontrada com o ID: " + notaRequest.getPastaId()));
            nota.setPasta(pasta);
        }

        if (notaRequest.getTagIds() != null && !notaRequest.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(notaRequest.getTagIds()));
            nota.setTags(tags);
        }

        return notaRepository.save(nota);
    }

    //Listar todas as notas
    @Transactional(readOnly = true)
    public List<NotaResponse> listarTodas() {
        return notaRepository.findAll().stream().map(NotaResponse::new).collect(Collectors.toList());
    }

    //Buscar nota por ID
    @Transactional(readOnly = true)
    public Optional<NotaResponse> buscarPorId(Long id) {
        return notaRepository.findById(id).map(NotaResponse::new);
    }

    //Deletar nota por ID
    public void deletar(Long id) {
        notaRepository.deleteById(id);
    }

    @Transactional
    public NotaResponse atualizar(Long id, NotaRequest notaRequest) {
        return notaRepository.findById(id).map(nota -> {
            nota.setTitulo(notaRequest.getTitulo());
            nota.setConteudo(notaRequest.getConteudo());

            if (notaRequest.getPastaId() != null) {
                Pasta pasta = pastaRepository.findById(notaRequest.getPastaId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pasta não encontrada com o ID: " + notaRequest.getPastaId()));
                nota.setPasta(pasta);
            } else {
                nota.setPasta(null); // Explicitly set to null if no pastaId is provided
            }

            if (notaRequest.getTagIds() != null && !notaRequest.getTagIds().isEmpty()) {
                Set<Tag> tags = new HashSet<>(tagRepository.findAllById(notaRequest.getTagIds()));
                nota.setTags(tags);
            } else {
                if (nota.getTags() == null) {
                    nota.setTags(new HashSet<>());
                }
                nota.getTags().clear();
            }

            Nota savedNota = notaRepository.save(nota);
            return new NotaResponse(savedNota);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota não encontrada com o ID: " + id));
    }

    public Nota atualizar(Long id, Nota notaAtualizada) {
        return notaRepository.findById(id).map(nota -> {
            nota.setTitulo(notaAtualizada.getTitulo());
            nota.setConteudo(notaAtualizada.getConteudo());
            nota.setPasta(notaAtualizada.getPasta());
            nota.setTags(notaAtualizada.getTags());
            return notaRepository.save(nota);
        }).orElseThrow(() -> new RuntimeException("Nota não encontrada"));
    }

    //método mestre-detalhe: Listar notas de uma pasta específica
    @Transactional(readOnly = true)
    public List<NotaResponse> listarNotasPorPasta(Long pastaId) {
        //1) busca a pasta para garantir que ela exista
        Pasta pasta = pastaRepository.findById(pastaId)
            .orElseThrow(() -> new RuntimeException("Pasta não encontrada com o id: " + pastaId));

        //2)acessar a lista de notas diretamente da entidade Pasta
        return pasta.getNotas().stream().map(NotaResponse::new).collect(Collectors.toList());
    }

    //método mestre-detalhe: Listar notas de uma tag específica
    @Transactional(readOnly = true)
    public List<NotaResponse> listarNotasPorTag(Long tagId) {
        // busca Notas associadas à Tag com o ID fornecido (via relacionamento Many-to-Many).
        List<Nota> notas = notaRepository.findByTagsId(tagId);
        
        if (notas.isEmpty() && !notaRepository.existsById(tagId)) { 
             // Se nenhuma nota for encontrada E a tag realmente não existir, lança uma exceção.
        }

        return notas.stream().map(NotaResponse::new).collect(Collectors.toList());
    }
}
