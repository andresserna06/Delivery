import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAddressesComponent } from './manage/manage.component';

const routes: Routes = [
  // Crear dirección sin orden

  { path: 'create/:order_id', component: ManageAddressesComponent },
  // Crear dirección **con order_id** (pasado como query param)
  // Ver dirección
  { path: 'view/:id', component: ManageAddressesComponent },

  // Actualizar dirección
  { path: 'update/:id', component: ManageAddressesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressesRoutingModule { }
