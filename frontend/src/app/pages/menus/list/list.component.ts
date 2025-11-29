import { Component, OnInit } from '@angular/core';
import { MenusService } from 'src/app/services/menus.service';
import { Router } from '@angular/router';
import { Menu } from 'src/app/models/menu.model';

@Component({
  selector: 'app-menu-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  menus: Menu[] = []; // inicializar como array vacío
  loading = false;
  error = '';

  constructor(
    private menusService: MenusService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.menusService.list().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // confirma que llegan
        this.menus = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar menús';
        this.loading = false;
      }
    });
  }

  delete(id: number) {
    this.menusService.delete(id).subscribe(() => {
      this.menus = this.menus.filter(m => m.id !== id);
    });
  }

  update(id: number) {
    this.router.navigate(['/menus/update', id]);
  }

  create() {
    this.router.navigate(['/menus/create']);
  }
}
