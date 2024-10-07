import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiURL = 'https://x0kau1froc.execute-api.ca-central-1.amazonaws.com/Dev'
  constructor(private http : HttpClient) { }
  fetchData(): Observable<any>{
    return this.http.get(this.apiURL);
  }
}