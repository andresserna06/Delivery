import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
  { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '' },
  { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '' },
  { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public menuItems: any[];
  public isCollapsed = true;
  user: User; // ← Agregar esto
  subscription: Subscription; // ← Agregar esto

  constructor(
    private router: Router,
    private securityService: SecurityService, // ← Agregar esto
    private firebaseAuthService: FirebaseAuthService // ← Agregar esto
  ) {
    // Suscribirse a los cambios del usuario
    this.subscription = this.securityService.getUser()
      .subscribe(data => {
        this.user = data;
      });
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Cerrar sesión de Firebase
        this.firebaseAuthService.logout().subscribe({
          next: () => {
            console.log('✅ Sesión de Firebase cerrada');
          },
          error: (err) => {
            console.error('❌ Error al cerrar sesión de Firebase:', err);
          }
        });

        // Cerrar sesión local
        this.securityService.logout();

        // Mostrar confirmación
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}