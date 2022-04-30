import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './private.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [{
  component: PrivateComponent,
  path: '',
  children: [
    { path: 'productos', loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule), canActivate: [AuthGuard] },
    // esto va en la linea de arriba , canActivate: [AuthGuard],
    { path: '**', redirectTo: 'productos' }
  ]
}];

@NgModule({
  declarations: [
    PrivateComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class PrivateModule { }
