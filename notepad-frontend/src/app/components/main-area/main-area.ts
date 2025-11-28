import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteEditor } from '../../components/note-editor/note-editor';
import { NoteGallery } from '../../components/note-gallery/note-gallery';
import { Nota } from '../../core/models/nota.model';

@Component({
  selector: 'app-main-area',
  standalone: true,
  imports: [CommonModule, NoteEditor, NoteGallery],
  templateUrl: './main-area.html',
  styleUrl: './main-area.scss'
})
export class MainArea {
  viewMode: 'gallery' | 'editor' = 'gallery';
  selectedNota: Nota | null = null;
  filterByPastaId: number | null = null;
  filterByTagId: number | null = null;

  switchToGallery(): void {
    this.viewMode = 'gallery';
  }

  switchToEditor(): void {
    this.viewMode = 'editor';
    this.selectedNota = null;
  }

  onFilterByPasta(pastaId: number): void {
    this.filterByPastaId = pastaId;
    this.filterByTagId = null;
    this.switchToGallery();
  }

  onFilterByTag(tagId: number): void {
    this.filterByTagId = tagId;
    this.filterByPastaId = null;
    this.switchToGallery();
  }

  onClearFilter(): void {
    this.filterByPastaId = null;
    this.filterByTagId = null;
    this.switchToGallery();
  }

  onNoteSelected(nota: Nota): void {
    this.selectedNota = nota;
    this.switchToEditor();
  }

  onNotaSaved(nota: Nota): void {
    this.selectedNota = null;
    this.switchToGallery();
    // A galeria recarrega automaticamente devido ao ngOnChanges
  }

  onNotaCanceled(): void {
    this.selectedNota = null;
    this.switchToGallery();
  }

  onNoteDeleted(nota: Nota): void {
    // A galeria já atualiza automaticamente
  }
}
