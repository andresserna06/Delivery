import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { DriversRoutingModule } from './drivers-routing.module';

@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DriversRoutingModule
  ]
})
export class DriversModule {}
