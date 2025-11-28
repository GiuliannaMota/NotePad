import { Component, ViewChild } from '@angular/core';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { MainArea } from './components/main-area/main-area';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Sidebar, MainArea],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild(MainArea) mainArea?: MainArea;

  title = 'NotePad';

  onFilterByPasta(pastaId: number): void {
    if (this.mainArea) {
      this.mainArea.onFilterByPasta(pastaId);
    }
  }

  onFilterByTag(tagId: number): void {
    if (this.mainArea) {
      this.mainArea.onFilterByTag(tagId);
    }
  }

  onClearFilter(): void {
    if (this.mainArea) {
      this.mainArea.onClearFilter();
    }
  }
}
