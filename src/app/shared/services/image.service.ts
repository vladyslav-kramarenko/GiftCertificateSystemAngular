import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private BASE_URL = `${environment.API_URL}/image/`;

  constructor(
    private http: HttpClient
  ) {
  }

  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.BASE_URL, formData, {responseType: 'text'});
  }

  getImage(path: string): Observable<Blob> {
    return this.http.get(this.BASE_URL + path, {responseType: 'blob'});
  }
}
