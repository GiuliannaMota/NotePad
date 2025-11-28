import { Component, EventEmitter, Input, Output, OnInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaService } from '../../core/services/nota.service';
import { Nota } from '../../core/models/nota.model';

@Component({
  selector: 'app-note-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-gallery.html',
  styleUrl: './note-gallery.scss'
})
export class NoteGallery implements OnInit, OnChanges {
  @Input() filterByPastaId: number | null = null;
  @Input() filterByTagId: number | null = null;
  @Output() noteSelected = new EventEmitter<Nota>();
  @Output() noteDeleted = new EventEmitter<Nota>();

  private notaService = inject(NotaService);

  notas: Nota[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadNotas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterByPastaId'] || changes['filterByTagId']) {
      this.loadNotas();
    }
  }

  loadNotas(): void {
    this.isLoading = true;

    let notasObservable;

    if (this.filterByPastaId) {
      notasObservable = this.notaService.getByPasta(this.filterByPastaId);
    } else if (this.filterByTagId) {
      notasObservable = this.notaService.getByTag(this.filterByTagId);
    } else {
      notasObservable = this.notaService.getAll();
    }

    notasObservable.subscribe({
      next: (notas) => {
        this.notas = notas;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar notas:', err);
        this.isLoading = false;
      }
    });
  }

  selectNota(nota: Nota): void {
    this.noteSelected.emit(nota);
  }

  deletNota(nota: Nota, event: Event): void {
    event.stopPropagation();

    if (confirm(`Tem certeza que deseja excluir a nota "${nota.titulo}"?`)) {
      this.notaService.delete(nota.id).subscribe({
        next: () => {
          this.notas = this.notas.filter(n => n.id !== nota.id);
          this.noteDeleted.emit(nota);
        },
        error: (err) => {
          console.error('Erro ao excluir nota:', err);
          alert('Erro ao excluir a nota. Tente novamente.');
        }
      });
    }
  }

  getPreview(conteudo: string): string {
    // Remove tags HTML, substitui &nbsp; e pega os primeiros 150 caracteres
    const plainText = conteudo.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
