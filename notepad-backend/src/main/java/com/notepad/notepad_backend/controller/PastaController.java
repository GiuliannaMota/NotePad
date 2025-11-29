package com.notepad.notepad_backend.controller;

import com.notepad.notepad_backend.model.Pasta;
import com.notepad.notepad_backend.service.PastaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })@RestController
@RequestMapping("/api/pastas") 
public class PastaController {
    
    @Autowired
    private PastaService pastaService;

    @PostMapping
    public Pasta criarPasta(@RequestBody Pasta pasta) {
        return pastaService.salvar(pasta);
    }

    @GetMapping
    public List<Pasta> listarPastas() {
        return pastaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pasta> buscarPastaPorId(@PathVariable Long id) {
        return pastaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pasta> atualizarPasta(@PathVariable Long id, @RequestBody Pasta pastaDetalhes) {
        return pastaService.buscarPorId(id)
                .map(pastaExistente -> {
                    pastaExistente.setNome(pastaDetalhes.getNome());
                    return ResponseEntity.ok(pastaService.salvar(pastaExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPasta(@PathVariable Long id) {
        if (pastaService.buscarPorId(id).isPresent()) {
            pastaService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
