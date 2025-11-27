import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { ManagePhotosComponent } from './manage/manage-photos.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManagePhotosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PhotosRoutingModule
  ]
})
export class PhotosModule { }
