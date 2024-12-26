// src/app/services/save-dreams.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private apiUrl = 'https://8l0517vu9g.execute-api.ca-central-1.amazonaws.com/new';

  constructor(private http: HttpClient) {}

  saveDream(UserID: string, DreamID: string): Observable<any> {
    const body = { UserID, DreamID };
    console.log(body);
    console.log( JSON.stringify(body));
    return this.http.post(this.apiUrl, body )
  }
}
