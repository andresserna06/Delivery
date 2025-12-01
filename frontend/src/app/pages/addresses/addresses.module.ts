import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressesRoutingModule } from './addresses-routing.module';
import { ManageAddressesComponent } from './manage/manage.component';

@NgModule({
  declarations: [
    ManageAddressesComponent,
    ManageAddressesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddressesRoutingModule
  ]
})
export class AddressesModule { }