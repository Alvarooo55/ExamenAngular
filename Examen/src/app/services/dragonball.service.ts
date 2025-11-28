import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

export interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  transformations: Transformation[];
}

export interface ApiResponse {
  items: Character[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DragonballService {
  private apiUrl = 'https://dragonball-api.com/api/characters';

  constructor(private http: HttpClient) { }

  getCharacters(page: number = 1): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=${page}&limit=10`);
  }

  getAllCharacters(): Observable<Character[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?limit=500`).pipe(
      map(response => response.items)
    );
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  getCharacterByName(name: string): Observable<Character | null> {
    return this.getAllCharacters().pipe(
      map(characters => {
        const found = characters.find(c => 
          c.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(c.name.toLowerCase())
        );
        return found || null;
      })
    );
  }
}
