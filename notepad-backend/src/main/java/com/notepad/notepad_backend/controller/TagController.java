package com.notepad.notepad_backend.controller;

import com.notepad.notepad_backend.model.Tag;
import com.notepad.notepad_backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    
    @Autowired
    private TagService tagService;

    @PostMapping
    public Tag criarTag(@RequestBody Tag tag) {
        return tagService.salvar(tag);
    }

    @GetMapping
    public List<Tag> listarTags() {
        return tagService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> atualizarTag(@PathVariable Long id, @RequestBody Tag tagDetalhes) {
        return tagService.buscarPorId(id)
                .map(tagExistente -> {
                    tagExistente.setNome(tagDetalhes.getNome());
                    return ResponseEntity.ok(tagService.salvar(tagExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTag(@PathVariable Long id) {
        if (tagService.buscarPorId(id).isPresent()) {
            tagService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
