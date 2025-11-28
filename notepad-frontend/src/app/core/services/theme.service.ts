import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(true); 

  constructor() {
    this.applyTheme();
  }
  
  private applyTheme(): void {
    const html = document.documentElement;
    
    html.removeAttribute('data-bs-theme');
    
  }
  
}