import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from "../../../environments/environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private BASE_URL = `${environment.API_URL}/image/`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
  }

  uploadImage(file: File): Observable<any> {
    console.log("uploadImage");
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.BASE_URL, formData, {responseType: 'text', headers})
      .pipe(
        catchError(this.handleError)
      );
  }

  getImage(path: string): Observable<Blob> {
    return this.http.get(this.BASE_URL + path, {responseType: 'blob'});
  }

  private handleError = (error: HttpErrorResponse) => {
    console.log("error.status: " + error.status);
    console.log(error.message);
    if (error.status === 401) this.authService.updateStatusToNotAuthorized();
    return throwError(error);
  }
}
