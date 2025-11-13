import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Filter = { type: 'all' | 'pasta' | 'tag'; id?: number | null };

@Injectable({ providedIn: 'root', })
export class FilterStateService {
  
  private subject = new BehaviorSubject<Filter>({ type: 'all', id: null });
  public filter$ = this.subject.asObservable();

  setFilter(f: Filter) {
    this.subject.next(f);
  }

  get current() {
    return this.subject.value;
  }
}
