import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/models/issue.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-issue',
  templateUrl: './list-issue.component.html',
  styleUrls: ['./list-issue.component.scss']
})
export class ListComponent implements OnInit {

  issues: Issue[] = [];   // Issues de la moto seleccionada
  motoId!: number;        // ID de la moto desde la URL

  constructor(
    private service: IssueService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la moto desde la ruta
    const param = this.route.snapshot.paramMap.get('motoId');
    this.motoId = param ? Number(param) : 0;

    // Traemos todos los issues del backend
    this.service.list().subscribe(data => {
      // Filtramos solo los issues de esta moto
      this.issues = data.filter(issue => issue.motorcycle_id === this.motoId);
    });
  }

  // Eliminar issue
  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Desea eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
          this.issues = this.issues.filter(i => i.id !== id);
        });
      }
    });
  }

}
