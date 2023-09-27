import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaReclamosComponent } from './lista-reclamos/lista-reclamos.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RespuestaReclamosComponent } from './respuesta-reclamos/respuesta-reclamos.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [
  {
    path:'registro',
    component : RegistroComponent
  },{
    path:'login',
    component : LoginComponent
  },{
    path : 'reporte',
    component : ListaReclamosComponent,
    canActivate : [AuthGuard]
  },{
    path : 'detalle',
    component : RespuestaReclamosComponent,
    canActivate : [AuthGuard]
  },{
    path : '**',
    redirectTo : 'registro'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
