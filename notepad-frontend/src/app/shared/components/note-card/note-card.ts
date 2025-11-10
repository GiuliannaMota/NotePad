import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Nota } from '../../../core/models/nota.model'; 
import { TruncatePipe } from '../../pipes/truncate-pipe'; 

@Component({
  selector: 'app-note-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    TruncatePipe
  ],
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss',
})

export class NoteCardComponent {
  // Recebe o objeto Nota do componente pai (Gallery)
  @Input({ required: true }) nota!: Nota;

  // Emite eventos de Ação
  @Output() edit = new EventEmitter<Nota>();
  @Output() delete = new EventEmitter<number>(); 

  // Métodos de utilidade
  confirmDelete(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      this.delete.emit(id);
    }
  }
}