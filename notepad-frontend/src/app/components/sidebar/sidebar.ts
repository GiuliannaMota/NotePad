import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PastaService } from '../../core/services/pasta.service';
import { TagService } from '../../core/services/tag.service';
import { Pasta } from '../../core/models/pasta.model';
import { Tag } from '../../core/models/tag.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {
  @Output() filterByPasta = new EventEmitter<number>();
  @Output() filterByTag = new EventEmitter<number>();
  @Output() clearFilter = new EventEmitter<void>();

  private pastaService = inject(PastaService);
  private tagService = inject(TagService);

  pastas: Pasta[] = [];
  tags: Tag[] = [];
  selectedPastaId: number | null = null;
  selectedTagId: number | null = null;

  showNewPastaInput = false;
  newPastaNome = '';
  showNewTagInput = false;
  newTagNome = '';

  ngOnInit(): void {
    this.loadPastas();
    this.loadTags();
  }

  loadPastas(): void {
    this.pastaService.getAll().subscribe({
      next: (pastas) => {
        this.pastas = pastas;
      },
      error: (err) => {
        console.error('Erro ao carregar pastas:', err);
      }
    });
  }

  loadTags(): void {
    this.tagService.getAll().subscribe({
      next: (tags) => {
        this.tags = tags;
      },
      error: (err) => {
        console.error('Erro ao carregar tags:', err);
      }
    });
  }

  selectPasta(pastaId: number): void {
    this.selectedPastaId = pastaId;
    this.selectedTagId = null;
    this.filterByPasta.emit(pastaId);
  }

  selectTag(tagId: number): void {
    this.selectedTagId = tagId;
    this.selectedPastaId = null;
    this.filterByTag.emit(tagId);
  }

  clearFilterSelection(): void {
    this.selectedPastaId = null;
    this.selectedTagId = null;
    this.clearFilter.emit();
  }

  toggleNewPastaInput(): void {
    this.showNewPastaInput = !this.showNewPastaInput;
    this.newPastaNome = '';
  }

  createPasta(): void {
    if (this.newPastaNome.trim()) {
      this.pastaService.create(this.newPastaNome).subscribe({
        next: () => {
          this.loadPastas();
          this.showNewPastaInput = false;
          this.newPastaNome = '';
        },
        error: (err) => {
          console.error('Erro ao criar pasta:', err);
        }
      });
    }
  }

  toggleNewTagInput(): void {
    this.showNewTagInput = !this.showNewTagInput;
    this.newTagNome = '';
  }

  createTag(): void {
    if (this.newTagNome.trim()) {
      this.tagService.create(this.newTagNome).subscribe({
        next: () => {
          this.loadTags();
          this.showNewTagInput = false;
          this.newTagNome = '';
        },
        error: (err) => {
          console.error('Erro ao criar tag:', err);
        }
      });
    }
  }

  deletePasta(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta pasta?')) {
      this.pastaService.delete(id).subscribe({
        next: () => {
          this.loadPastas();
          if (this.selectedPastaId === id) {
            this.clearFilterSelection();
          }
        },
        error: (err) => {
          console.error('Erro ao excluir pasta:', err);
        }
      });
    }
  }

  deleteTag(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      this.tagService.delete(id).subscribe({
        next: () => {
          this.loadTags();
          if (this.selectedTagId === id) {
            this.clearFilterSelection();
          }
        },
        error: (err) => {
          console.error('Erro ao excluir tag:', err);
        }
      });
    }
  }
}
