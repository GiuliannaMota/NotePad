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
    public ResponseEntity<Tag> criarTag(@RequestBody Tag tag) {
        Tag novaTag = tagService.salvar(tag);
        return ResponseEntity.ok(novaTag);
    }

    @GetMapping
    public ResponseEntity<List<Tag>> listarTags() {
        List<Tag> tags = tagService.listarTodas();
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> buscarTagPorId(@PathVariable Long id) {
        return tagService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> atualizarTag(
            @PathVariable Long id,
            @RequestBody Tag tagDetalhes
    ) {
        return tagService.buscarPorId(id)
                .map(tagExistente -> {
                    tagExistente.setNome(tagDetalhes.getNome());
                    Tag tagAtualizada = tagService.salvar(tagExistente);
                    return ResponseEntity.ok(tagAtualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTag(@PathVariable Long id) {
        if (tagService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        tagService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}