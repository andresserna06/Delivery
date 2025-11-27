import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePhotosComponent } from './manage/manage.component';

const routes: Routes = [
  { path: ':issueId', component: ManagePhotosComponent },
  { path: 'create/:issueId', component: ManagePhotosComponent } // Cada issue tiene sus fotos
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule { }
