package com.notepad.dto;

public class ResumoNotaResponse {
    private Long noteId;
    private String resumo;

    public ResumoNotaResponse(Long noteId, String resumo) {
        this.noteId = noteId;
        this.resumo = resumo;
    }

    public Long getNoteId() {
        return noteId;
    }

    public void setNoteId(Long noteId) {
        this.noteId = noteId;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(String resumo) {
        this.resumo = resumo;
    }
}