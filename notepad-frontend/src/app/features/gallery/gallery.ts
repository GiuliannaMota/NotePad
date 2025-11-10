import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


import { Nota } from 'src/app/core/models/nota.model';
import { NotaService } from 'src/app/core/services/nota.service';
import { FilterStateService, Filter } from 'src/app/core/services/filter-state.service';
import { NoteCardComponent } from 'src/app/shared/components/note-card/note-card';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NoteCardComponent,
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit{
  notas: Nota[] = [];

  // Emite a nota a ser editada para o MainAreaComponent
  @Output() editNote = new EventEmitter<Nota>();

  constructor(
    private notaService: NotaService,
    private filterStateService: FilterStateService
  ) { }

  ngOnInit(): void {
    // Escuta as mudanças de filtro e carrega as notas
    this.filterStateService.currentFilter.pipe(
      switchMap((filter: Filter) => this.loadNotes(filter))
    ).subscribe(notas => {
      this.notas = notas;
    });
  }

  // Permite que o MainAreaComponent force uma recarga de dados
  forceReload(): void {
      const currentFilter = this.filterStateService.getCurrentValue();
      this.loadNotes(currentFilter).pipe(take(1)).subscribe(notas => {
          this.notas = notas;
      });
  }

  // Carrega notas com base no filtro ativo, usando -1 para 'all'.
  loadNotes(filter: Filter): Observable<Nota[]> {
    // Verifica o ID -1 para carregar todas as notas
    if (filter.type === 'all' && filter.id === -1) {
      return this.notaService.listarNotas();
    } 
    // Verifica se o ID é positivo 
    else if (filter.type === 'pasta' && filter.id > 0) {
      return this.notaService.listarNotasPorPasta(filter.id);
    } else if (filter.type === 'tag' && filter.id > 0) {
      return this.notaService.listarNotasPorTag(filter.id);
    } else {
      // Caso o filtro seja inválido 
      return this.notaService.listarNotas();
    }
  }

  handleEdit(nota: Nota): void {
    // Emite o evento para o MainAreaComponent
    this.editNote.emit(nota);
  }

  handleDelete(id: number): void {
    this.notaService.deletarNota(id).subscribe(() => {
      // Recarrega as notas após a exclusão usando o filtro atual
      this.filterStateService.currentFilter.subscribe(filter => this.loadNotes(filter));
    });
  }
}
