import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Categorias } from '../interfaces/categorias.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  ruta = 'http://localhost:3000/categorias';

  private _refresh$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  saveCategoria = (data: any): Observable<any> => {
    return this.http.post(`${this.ruta}`, data)
      .pipe(
        tap(() => {
          this.refresh$.next();
        }
        )
      );
  }

  getCategoria = (id: number): Observable<Categorias> => {
    return this.http.get<Categorias>(`${this.ruta}/${id}`);
  }

  getCategorias = (): Observable<Categorias[]> => {
    return this.http.get<Categorias[]>(`${this.ruta}`);
  }

  updateCategoria = (data: any): Observable<any> => {
    return this.http.put(`${this.ruta}/${data.id}`, data)
      .pipe(
        tap(() => {
          this.refresh$.next();
        }
        )
      );
  }

  deleteCategoria = (id: number): Observable<any> => {
    return this.http.delete<any>(`${this.ruta}/${id}`)
      .pipe(
        tap(() => {
          this.refresh$.next();
        }
        )
      );
  }
}
