import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

// Angular Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

// ngx-quill Import
import { QuillModule } from 'ngx-quill';

// Imports de Core
import { Nota, CreateUpdateNotaDTO } from 'src/app/core/models/nota.model'; 
import { Pasta } from 'src/app/core/models/pasta.model';
import { Tag } from 'src/app/core/models/tag.model';
import { NotaService } from 'src/app/core/services/nota.service';
import { PastaService } from 'src/app/core/services/pasta.service';
import { TagService } from 'src/app/core/services/tag.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    QuillModule
  ],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor implements OnInit, OnChanges{

  // Entrada e Saída (Conexão com MainAreaComponent)
  @Input() note: Nota | null = null; 
  @Output() saveComplete = new EventEmitter<void>();

  notaForm!: FormGroup;
  pastas: Pasta[] = [];
  tagsDisponiveis: Tag[] = [];
  tagsSelecionadas: Tag[] = [];

  constructor(
    private fb: FormBuilder,
    private notaService: NotaService,
    private pastaService: PastaService,
    private tagService: TagService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
    // Se estiver no modo edição quando o componente for inicializado
    if (this.note) {
      this.patchForm(this.note);
    }
  }

  // Deteta mudanças no Input 'note' (usado pelo MainAreaComponent para alternar modos)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note']) {
      if (this.note) {
        this.patchForm(this.note);
      } else {
        // Modo Criação: Reseta o formulário e as tags
        this.notaForm.reset(); 
        this.tagsSelecionadas = [];
      }
    }
  }

  createForm(): void {
    this.notaForm = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      conteudo: ['', Validators.required],
      pastaId: [null, Validators.required], 
      tagsIds: [[]] 
    });
  }

  patchForm(nota: Nota): void {
    this.notaForm.patchValue({
      id: nota.id,
      titulo: nota.titulo,
      conteudo: nota.conteudo,
      pastaId: nota.pasta?.id || null
    });
    this.tagsSelecionadas = nota.tags || []; 
  }

  loadData(): void {
    // Carrega pastas e tags para os dropdowns/chips
    this.pastaService.listarPasta().pipe(take(1)).subscribe(data => this.pastas = data);
    this.tagService.listarTags().pipe(take(1)).subscribe(data => this.tagsDisponiveis = data);
  }

  // --- Lógica de Tags ---
  addTag(tag: Tag): void {
    if (tag && !this.tagsSelecionadas.find(t => t.id === tag.id)) {
      this.tagsSelecionadas.push(tag);
    }
  }

  removeTag(tag: Tag): void {
    this.tagsSelecionadas = this.tagsSelecionadas.filter(t => t.id !== tag.id);
  }

  // --- Lógica de Submissão ---
  onSubmit(): void {
    if (this.notaForm.invalid) {
      this.notaForm.markAllAsTouched();
      return;
    }

    const formValue = this.notaForm.value;

    // Constrói o DTO de transferência para a API
    const notaDTO: CreateUpdateNotaDTO = {
      titulo: formValue.titulo,
      conteudo: formValue.conteudo,
      pastaId: formValue.pastaId,
      tagIds: this.tagsSelecionadas.map(t => t.id!)
    };

    let operation$: Observable<Nota | any> = EMPTY;
    
    // Decide entre Atualizar ou Criar
    if (formValue.id) {
      operation$ = this.notaService.atualizarNota(formValue.id, notaDTO);
    } else {
      operation$ = this.notaService.criarNota(notaDTO);
    }

    operation$.pipe(take(1)).subscribe({
      next: () => {
        this.saveComplete.emit(); 
      },
      error: (err) => {
        console.error('Erro ao salvar nota:', err);
      }
    });
  }
  
}
