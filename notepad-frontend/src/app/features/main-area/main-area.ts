import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { Nota } from 'src/app/core/models/nota.model';
import { Gallery } from '../gallery/gallery';
import { Editor } from '../editor/editor';
@Component({
  selector: 'app-main-area',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    Gallery,
    Editor
  ],
  templateUrl: './main-area.html',
  styleUrl: './main-area.scss',
})
export class MainArea {

  //Define a visualização atural: 'gallery' ou 'editor'
  viewMode: 'gallery' | 'editor' = 'gallery';

  //Nota sendo editada (null para criação de uma nova nota)
  noteToEdit: Nota | null = null;

  //Alterna para o modo Editor e carrega a nota para edição
  switchToEditor(nota: Nota | null = null): void {
    this.noteToEdit = nota;
    this.viewMode = 'editor';
  }

  //Volta para o modo Galeria e reseta a nota em edição
  switchToGallery(): void {
    this.viewMode = 'gallery';
    this.noteToEdit = null;
  }

}
