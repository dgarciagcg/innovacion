import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { AuthResponse } from '../public/login/login.interface';
import { HttpClient } from '@angular/common/http';
import { UserLocalService } from './user-local.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  ruta = 'http://localhost:3000/productos';

  constructor(
    private http: HttpClient,
    private userLocalService: UserLocalService
  ) { }

  /**
   * Realiza la peticion para el ingreso a la aplicacion de un usuario
   * @param params Aqui van los datos del usuario
   * @returns Confirma o desaprueba el ingreso del usuario
   */
  login = (params: any): Observable<AuthResponse> => {
    return this.http.post<AuthResponse>(`${this.ruta}`, params);
  }

  /**
   * Realiza la salida permanente de un usuario de la aplicacion
   * @returns 
   */
  logout = () => this.userLocalService.removeToken();

}
