import { Component, OnInit, OnDestroy, Injectable } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms'; 
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators'; 

// Importações de Material (Mantidas)
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

// Importações de Core
import { Pasta, CreateUpdatePastaDTO } from '../../core/models/pasta.model'; 
import { Tag, CreateUpdateTagDTO } from '../../core/models/tag.model'; 
import { PastaService } from '../../core/services/pasta.service';
import { TagService } from '../../core/services/tag.service';

// --- Serviço de Estado Compartilhado (FilterStateService) ---
export interface Filter {
  type: 'all' | 'pasta' | 'tag';
  id: number | null;
}

@Injectable({providedIn: 'root'})
export class FilterStateService {
  private filterSource = new Subject<Filter>();
  currentFilter: Observable<Filter> = this.filterSource.asObservable(); 

  setFilter(filter: Filter) {
    this.filterSource.next(filter);
  }
}

// --- Componente Sidebar ---
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {
  pastas: Pasta[] = [];
  tags: Tag[] = [];
  
  // Variáveis de controle de memória
  private destroy$ = new Subject<void>(); 

  // Variáveis para criação e edição
  isCreatingPasta = false;
  newPastaName = new FormControl('', Validators.required);
  isEditingPasta: number | null = null;
  editPastaName = new FormControl('', Validators.required);

  isCreatingTag = false;
  newTagName = new FormControl('', Validators.required);
  isEditingTag: number | null = null;
  editTagName = new FormControl('', Validators.required);


  constructor(
    private pastaService: PastaService,
    private tagService: TagService,
    private filterStateService: FilterStateService
  ) { }

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarDadosIniciais(): void {
    this.listarPastas(); 
    this.listarTags();   
    this.filterStateService.setFilter({ type: 'all', id: null });
  }

  // LÓGICA DE LISTAGEM (Leitura) 
  listarPastas(): void {
    // CORRIGIDO/ADAPTADO: Uso de 'listarPasta'
    this.pastaService.listarPasta().pipe(takeUntil(this.destroy$)).subscribe({
      next: data => this.pastas = data,
      error: (err) => console.error('Erro ao listar pastas:', err)
    });
  }

  listarTags(): void {
    // CORRIGIDO/ADAPTADO: Uso de 'listarTags'
    this.tagService.listarTags().pipe(takeUntil(this.destroy$)).subscribe({
      next: data => this.tags = data,
      error: (err) => console.error('Erro ao listar tags:', err)
    });
  }
  
  // LÓGICA DE CRIAÇÃO 
  toggleNewPastaForm(event: Event): void {
    event.stopPropagation();
    this.isCreatingPasta = !this.isCreatingPasta;
    this.newPastaName.reset();
  }

  criarPasta(): void {
    // 📢 LINHA DE TESTE: Avisa que a função começou
    console.log('--- EXECUTANDO CRIAR PASTA ---');

    if (this.newPastaName.invalid) {
        console.warn('Criação abortada: Formulário Inválido.');
        return;
    }    const dto: CreateUpdatePastaDTO = { nome: this.newPastaName.value! }; 

    this.pastaService.criarPasta(dto).pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        this.listarPastas(); 
        this.isCreatingPasta = false;
        this.newPastaName.reset();
        console.log('Pasta criada com sucesso! (Chama listarPastas())');
      },
      // Adiciona um tratamento de erro para ver falhas da API
        (error) => {
            console.error('ERRO na API ao criar pasta:', error);
        }
    );
  }
  
  toggleNewTagForm(event: Event): void {
    event.stopPropagation();
    this.isCreatingTag = !this.isCreatingTag;
    this.newTagName.reset();
  }

  criarTag(): void {
    if (this.newTagName.invalid) return;
    const dto: CreateUpdateTagDTO = { nome: this.newTagName.value! }; 

    this.tagService.criarTag(dto).pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        this.listarTags();
        this.isCreatingTag = false;
        this.newTagName.reset();
      }
    );
  }
  
  // LÓGICA DE EDIÇÃO (Atualização) 
  // Inicia o modo de edição 
  iniciarEdicaoPasta(pasta: Pasta): void {
    this.isEditingPasta = pasta.id;
    this.editPastaName.setValue(pasta.nome);
  }

  atualizarPasta(id: number): void {
    if (this.editPastaName.invalid) return;
    const dto: CreateUpdatePastaDTO = { nome: this.editPastaName.value! };

    this.pastaService.atualizarPasta(id, dto).pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        this.listarPastas();
        this.isEditingPasta = null; 
        this.editPastaName.reset();
      }
    );
  }

  cancelarEdicaoPasta(): void {
    this.isEditingPasta = null;
  }
  
  iniciarEdicaoTag(tag: Tag): void {
    this.isEditingTag = tag.id;
    this.editTagName.setValue(tag.nome);
  }

  atualizarTag(id: number): void {
    if (this.editTagName.invalid) return;
    const dto: CreateUpdateTagDTO = { nome: this.editTagName.value! };

    this.tagService.atualizarTag(id, dto).pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        this.listarTags();
        this.isEditingTag = null; 
        this.editTagName.reset();
      }
    );
  }

  cancelarEdicaoTag(): void {
    this.isEditingTag = null;
  }

  // LÓGICA DE EXCLUSÃO (Delete) 
  deletarPasta(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta pasta?')) {
      this.pastaService.deletarPasta(id).pipe(takeUntil(this.destroy$)).subscribe(
        () => {
          this.listarPastas();
          this.filterStateService.setFilter({ type: 'all', id: null }); 
        }
      );
    }
  }

  deletarTag(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      this.tagService.deletarTag(id).pipe(takeUntil(this.destroy$)).subscribe(
        () => {
          this.listarTags();
          this.filterStateService.setFilter({ type: 'all', id: null });
        }
      );
    }
  }

  // LÓGICA DE FILTRO 
  selectFilter(type: 'all' | 'pasta' | 'tag', id: number | null): void {
    this.filterStateService.setFilter({ type, id });
  }
}