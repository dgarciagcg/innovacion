import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Productos } from 'src/app/interfaces/productos.interface';
import { LoginService } from 'src/app/services/login.service';
import { ProductosService } from 'src/app/services/productos.service';
import { UserLocalService } from 'src/app/services/user-local.service';

/* Alertify y Bootstrap */
declare let alertify: any;
declare let bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formularioLogin = new FormGroup({});

  producto!: Productos;
  productos: Productos[] = [];

  constructor(
    private loginService: LoginService,
    private productosService: ProductosService,
    private fb: FormBuilder,
    private userLocalService: UserLocalService,
  ) { }

  ngOnInit(): void {
    this.initFormLogin();
    this.getProductos();
  }

  /** Inicializa el formulario del login con la validaciones por defecto */
  initFormLogin = () => {
    this.formularioLogin = this.fb.group({
      codigo: ['', [Validators.required]],
    });
  }

  getProductos = () => {
    this.productosService.getProductos().subscribe((response: any) => {
      this.productos = response;
    })
  }

  /** Me permite loguearme en la aplicación */
  loguearse = () => {
    if (this.formularioLogin.valid) {
      const codigo = this.formularioLogin.value.codigo;
      const filtro = this.productos.filter(elm => elm.codigo === codigo);
      if (filtro.length === 0) {
        alertify.error('El producto no existe')
      } else if (filtro.length > 0) {
        this.userLocalService.saveToken(filtro[0].codigo);
        window.location.reload();
      }
    } else {
      alertify.error('Faltan campos por diligenciar')
    }
  }
}
