import { Injectable } from '@angular/core';

// import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserLocalService {

  public token: any = '';
  public id_usuario = '';
  public nombre = '';
  public correo = '';

  constructor() { }

  saveToken = (token: string) => window.localStorage.setItem('access_token', token);

  removeToken = () => window.localStorage.removeItem('access_token');

  getToken = () => window.localStorage.getItem('access_token');

}
