import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/restaurants', title: 'Restaurantes', icon: 'ni-shop text-blue', class: '' },
  { path: '/customers', title: 'Clientes', icon: 'ni-badge text-orange', class: '' },
  { path: '/menus', title: 'Menú', icon: 'ni-book-bookmark text-yellow', class: '' },
  { path: '/products', title: 'Productos', icon: 'ni-box-2 text-primary', class: '' },
  { path: '/orders/list', title: 'Órdenes', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/motorcycles', title: 'Motocicletas', icon: 'fas fa-motorcycle text-info', class: '' },
  { path: '/drivers', title: 'Conductores', icon: 'ni-circle-08 text-pink', class: '' },
  { path: '/shifts', title: 'Turnos', icon: 'ni-time-alarm text-blue', class: '' },
  { path: '/charts', title: 'Gráficos', icon: 'ni-chart-bar-32 text-green', class: '' },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  // === VARIABLES FALTANTES ===
  photoURL: string = '';
  defaultAvatar: string = 'assets/img/theme/default-user.png';
  userName: string = 'Usuario';

  constructor(
    private router: Router,
    private securityService: SecurityService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    // Cargar datos del usuario desde localStorage
    const sessionString = localStorage.getItem('sesion');

    if (sessionString) {
      const session = JSON.parse(sessionString);
      this.photoURL = session.photoURL || this.defaultAvatar;
      this.userName = session.name || 'Usuario';
    }

    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
  }

  logout() {
    this.securityService.logout();
    this.router.navigate(['/login']);
  }
}
