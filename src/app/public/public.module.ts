import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginGuard } from '../guards/login.guard';

const routes: Routes = [{
  component: PublicComponent,
  path: '',
  children: [
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    // , canActivate: [LoginGuard]
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
  ]
}];

@NgModule({
  declarations: [
    PublicComponent,
    LoginComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    // FormsModule,
    // HttpClientModule,
  ]
})
export class PublicModule { }
