import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Productos } from '../interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  ruta = 'http://localhost:3000/productos';

  private _refresh$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  saveProducto = (data: any): Observable<any> => {
    return this.http.post(`${this.ruta}`, data)
      .pipe(
        tap(() => {
          this.refresh$.next();
        }
        )
      );
  }

  getProducto = (id: number): Observable<Productos> => {
    return this.http.get<Productos>(`${this.ruta}/${id}`);
  }

  getProductos = (): Observable<Productos[]> => {
    return this.http.get<Productos[]>(`${this.ruta}`);
  }

  updateProducto = (data: any): Observable<any> => {
    return this.http.put(`${this.ruta}/${data.id}`, data)
    .pipe(
      tap(() => {
        this.refresh$.next();
      }
      )
    );
  }

  deleteProducto = (id: number): Observable<any> => {
    return this.http.delete<any>(`${this.ruta}/${id}`)
    .pipe(
      tap(() => {
        this.refresh$.next();
      }
      )
    );
  }

  cambiarEstado = (data: any): Observable<any> => {
    return this.http.put<any>(`${this.ruta}/${data.id}`, data)
    .pipe(
      tap(() => {
        this.refresh$.next();
      }
      )
    );
  }
}
