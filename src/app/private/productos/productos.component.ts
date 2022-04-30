import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Categorias } from 'src/app/interfaces/categorias.interface';
import { Productos } from 'src/app/interfaces/productos.interface';
import { CategoriasService } from 'src/app/services/categorias.service';
import { LoginService } from 'src/app/services/login.service';
import { ProductosService } from 'src/app/services/productos.service';

/* Alertify y Bootstrap */
declare let alertify: any;
declare let bootstrap: any;

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy {

  formularioCrear = new FormGroup({});
  formularioEditar = new FormGroup({});

  productos: Productos[] = [];
  productosActivos: Productos[] = [];
  productosInactivos: Productos[] = [];
  producto!: Productos;

  categorias: Categorias[] = [];

  subscripcion!: Subscription;
  subscripcionCategorias!: Subscription;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.productosActivos = [];
    this.productosInactivos = [];
    this.initFormCrear();
    this.initFormEditar();
    this.getCategorias();
    this.getProductos();
    this.subscripcion = this.productosService.refresh$.subscribe(() => {
      this.productosActivos = [];
      this.productosInactivos = [];
      this.initFormCrear();
      this.initFormEditar();
      this.getCategorias();
      this.getProductos();
    });
    this.subscripcionCategorias = this.categoriasService.refresh$.subscribe(() => {
      this.getCategorias();
    })
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
    console.log('Observable cerrado');
  }

  /** Inicializa el formulario del producto con la validaciones por defecto */
  initFormCrear = () => {
    this.formularioCrear = this.fb.group({
      id: [''],
      producto: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      codigo: ['', [Validators.required]],
      estado: [true, [Validators.required]],
      descripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      precio: ['', [Validators.required]],
      idCategoria: [0, [Validators.required]],
    });
  }

  /** Inicializa el formulario del producto con la validaciones por defecto */
  initFormEditar = () => {
    this.formularioEditar = this.fb.group({
      id: ['', [Validators.required]],
      producto: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      idCategoria: ['', [Validators.required]],
    });
  }

  saveProducto = () => {
    if (!this.formularioCrear.valid) {
      const controles = Object.keys(this.formularioCrear.controls);
      for (let index = 0; index < controles.length; index++) {
        if (this.formularioCrear.get(controles[index])?.invalid) {
          return alertify.error(`El campo: ${controles[index]} no es válido`);
        }
      }
      return alertify.error('Faltan campos por diligenciar');
    }

    this.productosService.saveProducto(this.formularioCrear.value).subscribe((response: any) => {
      alertify.success('Guardado!');
    });
  }

  updateProducto = () => {
    if (!this.formularioEditar.valid) {
      const controles = Object.keys(this.formularioEditar.controls);
      for (let index = 0; index < controles.length; index++) {
        if (this.formularioEditar.get(controles[index])?.invalid) {
          return alertify.error(`El campo: ${controles[index]} no es válido`);
        }
      }
      return alertify.error('Faltan campos por diligenciar');
    }
    this.productosService.updateProducto(this.formularioEditar.value).subscribe((response: any) => {
      const modalConfirmacion = document.querySelector('#editar') as HTMLElement;
      const modalToOpenInstance = bootstrap.Modal.getOrCreateInstance(modalConfirmacion);
      modalToOpenInstance?.hide();
      alertify.success('Guardado!');
    });
  }

  getProductos = () => {
    this.productosService.getProductos().subscribe((response: any) => {
      this.productos = response;
      for (let i = 0; i < this.productos.length; i++) {
        if (this.productos[i].estado) {
          this.productosActivos.push(this.productos[i]);
        } else if (!this.productos[i].estado) {
          this.productosInactivos.push(this.productos[i]);
        }
      }
    })
  }

  getCategorias = () => {
    this.categoriasService.getCategorias().subscribe((response: any) => {
      this.categorias = response;
    })
  }

  getProducto = (id: any) => {
    this.productosService.getProducto(id).subscribe((response: any) => {
      this.producto = response;
      this.setValueProducto(this.producto);
    })
  }

  deleteProducto = (id: any) => {
    this.productosService.deleteProducto(id).subscribe((response: any) => {
      alertify.success('Eliminado!');
    })
  }

  cambiarEstado = (producto: any) => {
    if (producto.estado) {
      producto.estado = false;
    } else {
      producto.estado = true;
    }
    this.productosService.cambiarEstado(producto).subscribe((response: any) => {
      alertify.success('Actualizado!');
    })
  }

  setValueProducto = (producto: any) => Object.keys(producto).forEach(elm =>
    this.formularioEditar.get(elm)?.setValue(producto[elm])
  );

  // Cerrar sesión, destruye el token de seguridad
  logout = () => {
    this.loginService.logout();
    window.location.reload();
  }

}
