package com.notepad.notepad_backend.controller;

import com.notepad.dto.NotaRequest;
import com.notepad.dto.NotaResponse;
import com.notepad.notepad_backend.model.Nota;
import com.notepad.notepad_backend.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @PostMapping
    public ResponseEntity<Nota> criar(@RequestBody NotaRequest notaRequest) {
        Nota novaNota = notaService.salvar(notaRequest);
        return ResponseEntity.ok(novaNota);
    }

    @GetMapping
    public List<NotaResponse> listarNotas(
            @RequestParam(required = false) Long pastaId,
            @RequestParam(required = false) Long tagId) {
        if (pastaId != null) {
            return notaService.listarNotasPorPasta(pastaId);
        } else if (tagId != null) {
            return notaService.listarNotasPorTag(tagId);
        } else {
            return notaService.listarTodas();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaResponse> buscarPorId(@PathVariable Long id) {
        Optional<NotaResponse> nota = notaService.buscarPorId(id);
        return nota.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotaResponse> atualizar(@PathVariable Long id, @RequestBody NotaRequest notaRequest) {
        NotaResponse notaAtualizada = notaService.atualizar(id, notaRequest);
        return ResponseEntity.ok(notaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        notaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
