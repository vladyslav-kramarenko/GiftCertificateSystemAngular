import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tag} from "../models/ITag";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) {
  }

  getPopularTags(size: number,page: number = 0): Observable<Tag[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${environment.API_URL}/tags/popular`;
    return this.http.get<any>(url, {params})
      .pipe(
        map(response => response._embedded.tagDTOList)
      );
  }
}
