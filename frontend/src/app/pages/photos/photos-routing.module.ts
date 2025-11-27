import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePhotosComponent } from './manage/manage.component';

const routes: Routes = [
  {
    path: 'issue/:issueId/moto/:motoId',
    component: ManagePhotosComponent        // Ver fotos
  },
  {
    path: 'issue/:issueId/moto/:motoId/create',
    component: ManagePhotosComponent        // Crear foto
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule { }
