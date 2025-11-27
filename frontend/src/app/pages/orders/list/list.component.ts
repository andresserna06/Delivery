import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  orders: Order[] = [];   // ← ESTA ES LA PROPIEDAD QUE TE FALTABA

  constructor(private service: OrderService) { }

  ngOnInit(): void {
    this.service.list().subscribe(data => {
      this.orders = data;
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Delete Order',
      text: 'Are you sure you want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Order deleted successfully.',
            'success'
          );

          this.ngOnInit(); // vuelve a cargar la tabla
        });
      }

    });
  }

}
