import { Component, OnInit, ɵɵi18nApply } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf, *ngFor, etc.
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { Sidebar } from './features/sidebar/sidebar';
import { MainArea } from './features/main-area/main-area';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    Sidebar,
    MainArea
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  isDarkTheme: boolean = true;

  // Método do ciclo de vida chamado logo após o Angular inicializar o componente.
  ngOnInit(): void {
      this.isDarkTheme = localStorage.getItem('theme') === 'dark' || true;
      this.applyTheme();
  }

  // Função pública chamada para alternar o tema.
  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  // Função para adicionar ou remover as classes de tema no <body> do HTML.
  private applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    document.body.classList.toggle('light-theme', !this.isDarkTheme);
  }
}
