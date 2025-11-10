import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface Filter{
    type: 'all' | 'pasta' | 'tag';
    id: number;
}

@Injectable({ providedIn: 'root' })
export class FilterStateService {

  private filterSource = new BehaviorSubject<Filter>({ type: 'all', id: -1 });    
  currentFilter = this.filterSource.asObservable();

  setFilter(filter: Filter) {
    this.filterSource.next(filter);
  }

  //Método para obter o valor atual do filtro
  getCurrentValue(): Filter {
      return this.filterSource.value;
  }
}