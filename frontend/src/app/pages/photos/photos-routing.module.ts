import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePhotosComponent } from './manage/manage-photos.component';

const routes: Routes = [
  { path: 'issue/:issueId/moto/:motoId', component: ManagePhotosComponent },       // ver fotos
  { path: 'issue/:issueId/moto/:motoId/create', component: ManagePhotosComponent }, // crear foto
  { path: 'issue/:issueId/moto/:motoId/edit/:photoId', component: ManagePhotosComponent } // editar foto
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule { }
