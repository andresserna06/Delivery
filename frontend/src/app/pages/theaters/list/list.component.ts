import { Component, OnInit } from '@angular/core';
import { Theater } from 'src/app/models/theater.model';
import { TheaterService } from 'src/app/services/theaters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  theaters:Theater[] = [];

  constructor(private service:TheaterService) { } // Aqui se hace la inyeccion de dependencia 

  ngOnInit(): void {
    this.service.list().subscribe(data => {
      this.theaters = data; // Casteo el backend se pasa a una lista de teatros 
    });
  }

  delete(id: number) {
      console.log("Delete theater with id:", id);
      Swal.fire({
        title: 'Eliminar',
        text: "Está seguro que quiere eliminar el registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.delete(id).
            subscribe(data => {
              Swal.fire(
                'Eliminado!',
                'Registro eliminado correctamente.',
                'success'
              )
              this.ngOnInit();
            });
        }
      })
    }

}
