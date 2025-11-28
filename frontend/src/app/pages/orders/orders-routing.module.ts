import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrdersComponent } from './list/list-orders.component';
import { ManageOrdersComponent } from './manage/manage-orders.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListOrdersComponent
  },
  {
    path: 'create',
    component: ManageOrdersComponent
  },
  {
    path: 'update/:id',
    component: ManageOrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
