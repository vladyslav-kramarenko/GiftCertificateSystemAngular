import { BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  setSearchTerm(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }
}
