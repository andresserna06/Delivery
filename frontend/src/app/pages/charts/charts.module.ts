import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';  // <-- Import correcto
import { ChartsRoutingModule } from './charts-routing.module';
import { ViewComponent } from './view/view.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    NgChartsModule,        // <-- Muy importante
    ChartsRoutingModule,
    HttpClientModule
  ]
})
export class ChartsModule { }
