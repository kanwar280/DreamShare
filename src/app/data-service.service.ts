import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiURL = 'https://x0kau1froc.execute-api.ca-central-1.amazonaws.com/Dev'
  private cachedData: any[] | null = null;

  constructor(private http : HttpClient) { }

  fetchData(): Observable<any>{
    if (this.cachedData) {
      // Return cached data as Observable
      return of(this.cachedData);
    } else {
    return this.http.get<any>(this.apiURL).pipe(
      map((response)=> {
        return JSON.parse(response.body);
      })
    );
  }
}
}
