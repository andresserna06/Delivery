import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { ListOrdersComponent } from './list/list-orders.component';
import { ManageOrdersComponent } from './manage/manage-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListOrdersComponent,
    ManageOrdersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
