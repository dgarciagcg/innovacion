import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Categorias } from 'src/app/interfaces/categorias.interface';
import { CategoriasService } from 'src/app/services/categorias.service';

/* Alertify y Bootstrap */
declare let alertify: any;
declare let bootstrap: any;

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  @Input() categorias: Categorias[] = [];

  formularioCrearCategoria = new FormGroup({});
  formularioEditarCategoria = new FormGroup({});

  // categorias: Categorias[] = [];
  categoria!: Categorias;

  subscripcion!: Subscription;

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService
  ) { }

  ngOnInit(): void {
    this.initFormCrear();
    this.initFormEditar();
    this.getCategorias();
    this.subscripcion = this.categoriasService.refresh$.subscribe(() => {
      this.initFormCrear();
      this.initFormEditar();
      this.getCategorias();
    })
  }

  /** Inicializa el formulario del categoria con la validaciones por defecto */
  initFormCrear = () => {
    this.formularioCrearCategoria = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      tipo: ['A', [Validators.required]],
    });
  }

  /** Inicializa el formulario del categoria con la validaciones por defecto */
  initFormEditar = () => {
    this.formularioEditarCategoria = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      tipo: ['', [Validators.required]],
    });
  }

  saveCategoria = () => {
    if (!this.formularioCrearCategoria.valid) {
      const controles = Object.keys(this.formularioCrearCategoria.controls);
      for (let index = 0; index < controles.length; index++) {
        if (this.formularioCrearCategoria.get(controles[index])?.invalid) {
          return alertify.error(`El campo: ${controles[index]} no es válido`);
        }
      }
      return alertify.error('Faltan campos por diligenciar');
    }

    this.categoriasService.saveCategoria(this.formularioCrearCategoria.value).subscribe((response: any) => {
      alertify.success('Guardado!');
    });
  }

  updateCategoria = () => {
    if (!this.formularioEditarCategoria.valid) {
      const controles = Object.keys(this.formularioEditarCategoria.controls);
      for (let index = 0; index < controles.length; index++) {
        if (this.formularioEditarCategoria.get(controles[index])?.invalid) {
          return alertify.error(`El campo: ${controles[index]} no es válido`);
        }
      }
      return alertify.error('Faltan campos por diligenciar');
    }
    const modalConfirmacion2 = document.querySelector('#editarCategoria') as HTMLElement;
    const modalToOpenInstance2 = bootstrap.Modal.getOrCreateInstance(modalConfirmacion2);
    modalToOpenInstance2?.hide();

    this.categoriasService.updateCategoria(this.formularioEditarCategoria.value).subscribe((response: any) => {
      const modalConfirmacion = document.querySelector('#categorias') as HTMLElement;
      const modalToOpenInstance = bootstrap.Modal.getOrCreateInstance(modalConfirmacion);
      modalToOpenInstance?.show();
      alertify.success('Guardado!');
    });
  }

  getCategorias = () => {
    this.categoriasService.getCategorias().subscribe((response: any) => {
      this.categorias = response;
    })
  }

  getCategoria = (id: any) => {
    const modalConfirmacion = document.querySelector('#categorias') as HTMLElement;
    const modalToOpenInstance = bootstrap.Modal.getOrCreateInstance(modalConfirmacion);
    modalToOpenInstance?.hide();
    console.log(id);
    this.categoriasService.getCategoria(id).subscribe((response: any) => {
      this.categoria = response;
      const modalConfirmacion2 = document.querySelector('#editarCategoria') as HTMLElement;
      const modalToOpenInstance2 = bootstrap.Modal.getOrCreateInstance(modalConfirmacion2);
      modalToOpenInstance2?.show();
      this.setValueCategoria(this.categoria);
    })
  }

  deleteCategoria = (id: any) => {
    this.categoriasService.deleteCategoria(id).subscribe((response: any) => {
      alertify.success('Eliminado!');
    })
  }

  setValueCategoria = (categoria: any) => Object.keys(categoria).forEach(elm =>
    this.formularioEditarCategoria.get(elm)?.setValue(categoria[elm])
  );

}
