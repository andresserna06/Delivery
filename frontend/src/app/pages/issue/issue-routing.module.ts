import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  // Listado de issues de una moto
  { path: 'motoId/:motoId', component: ListComponent },

  // Crear issue → necesitamos saber la motoId
  { path: 'create/:motoId', component: ManageComponent },

  // Actualizar issue → necesitamos solo el id del issue
  { path: 'update/:id', component: ManageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueRoutingModule { }
