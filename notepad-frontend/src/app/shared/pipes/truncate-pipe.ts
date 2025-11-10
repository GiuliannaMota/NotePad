import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(
    value: string, 
    limit: number = 100, 
    word: boolean = false, 
    trail: string = '...'
  ): string {
    if (!value) {
      return '';
    }
    
    // 1. Remove tags HTML
    const cleanValue = value.replace(/<[^>]*>/g, ''); 
    
    if (cleanValue.length <= limit) {
      return cleanValue;
    }

    let truncated = cleanValue.substring(0, limit);
    
    // 2. Lógica para não cortar palavras se 'word' for true
    if (word) {
      // Encontra a última posição do espaço antes do limite
      const lastSpace = truncated.lastIndexOf(' ');
      // Se um espaço for encontrado, corta até ele
      if (lastSpace > 0) {
        truncated = truncated.substring(0, lastSpace);
      }
    }
    
    return truncated + trail;
  }
}