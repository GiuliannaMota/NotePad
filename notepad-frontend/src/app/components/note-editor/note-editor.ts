import { Component, EventEmitter, Input, Output, OnInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NotaService } from '../../core/services/nota.service';
import { PastaService } from '../../core/services/pasta.service';
import { TagService } from '../../core/services/tag.service';
import { Nota, CreateUpdateNotaDTO } from '../../core/models/nota.model';
import { Pasta } from '../../core/models/pasta.model';
import { Tag } from '../../core/models/tag.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './note-editor.html',
  styleUrl: './note-editor.scss'
})
export class NoteEditor implements OnInit, OnChanges {
  @Input() selectedNota: Nota | null = null;
  @Output() notaSaved = new EventEmitter<Nota>();
  @Output() notaCanceled = new EventEmitter<void>();

  private notaService = inject(NotaService);
  private pastaService = inject(PastaService);
  private tagService = inject(TagService);

  nota: Partial<Nota> = this.initializeNota();
  pastas: Pasta[] = [];
  allTags: Tag[] = [];
  selectedTags: Tag[] = [];
  isSaving = false;

  showAvailableTags: boolean = false;
  
  public quillConfig = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, false] }],
      ]
    }
  };

  ngOnInit(): void {
    this.loadPastas();
    this.loadTags();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedNota'] && this.selectedNota) {
      this.loadNotaForEdit(this.selectedNota);
    } else if (changes['selectedNota'] && !this.selectedNota) {
      this.resetForm();
    }
  }

  private initializeNota(): Partial<Nota> {
    return {
      titulo: '',
      conteudo: '',
      pasta: undefined,
      tags: []
    };
  }

  loadPastas(): void {
    this.pastaService.getAll().subscribe({
      next: (pastas) => {
        this.pastas = pastas;
      },
      error: (err) => console.error('Erro ao carregar pastas:', err)
    });
  }

  loadTags(): void {
    this.tagService.getAll().subscribe({
      next: (tags) => {
        this.allTags = tags;
      },
      error: (err) => console.error('Erro ao carregar tags:', err)
    });
  }

  loadNotaForEdit(nota: Nota): void {
    this.nota = { ...nota };
    this.selectedTags = [...nota.tags];
  }

  toggleTag(tag: Tag): void {
    const index = this.selectedTags.findIndex(t => t.id === tag.id);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
  }

  toggleTagSelectionArea(): void {
    this.showAvailableTags = !this.showAvailableTags;
  }

  isTagSelected(tag: Tag): boolean {
    return this.selectedTags.some(t => t.id === tag.id);
  }

  removeTag(tag: Tag): void {
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
  }

  saveNota(): void {
    if (!this.nota.titulo?.trim()) {
      alert('Por favor, insira um título para a nota.');
      return;
    }

    if (!this.nota.pasta) {
      alert('Por favor, selecione uma pasta.');
      return;
    }

    if (this.selectedTags.length === 0) {
      alert('Por favor, selecione pelo menos uma tag.');
      return;
    }

    this.isSaving = true;

    const notaDto: CreateUpdateNotaDTO = {
      titulo: this.nota.titulo,
      conteudo: this.nota.conteudo || '',
      pastaId: this.nota.pasta.id,
      tagIds: this.selectedTags.map(t => t.id)
    };

    const operation = this.nota.id
      ? this.notaService.update(this.nota.id, notaDto)
      : this.notaService.create(notaDto);

    operation.subscribe({
      next: (savedNota) => {
        this.isSaving = false;
        this.notaSaved.emit(savedNota);
        this.resetForm();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Erro ao salvar nota:', err);
        alert('Erro ao salvar a nota. Tente novamente.');
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
    this.notaCanceled.emit();
  }

  private resetForm(): void {
    this.nota = this.initializeNota();
    this.selectedTags = [];
  }
}
