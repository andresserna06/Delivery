import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { ManagePhotosComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ManagePhotosComponent
  ],
  imports: [
    CommonModule,
    PhotosRoutingModule
  ]
})
export class PhotosModule { }
