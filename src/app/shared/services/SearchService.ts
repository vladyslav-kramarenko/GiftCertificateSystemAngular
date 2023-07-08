import {BehaviorSubject, Subject} from 'rxjs';
import {Injectable} from "@angular/core";
import {debounceTime} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  private searchTrigger = new Subject<string>();

  searchTerm$ = this.searchTermSubject.asObservable();

  constructor() {
    this.searchTrigger.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => this.setSearchTermDirectly(searchTerm));
  }

  setSearchTerm(searchTerm: string): void {
    this.searchTrigger.next(searchTerm);
  }

  private setSearchTermDirectly(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }
}
