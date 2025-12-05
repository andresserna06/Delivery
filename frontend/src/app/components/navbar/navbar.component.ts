import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  user: User;
  subscription: Subscription; // Debe de estar pendiente de alguien 
  constructor(location: Location,
    private element: ElementRef,
    private router: Router,
    private webSocketService: WebSocketService,
    private securityService: SecurityService) {
    this.location = location;
    this.subscription = this.securityService.getUser() // Aca es para estar pendiente de los cambios de la variable Reactiva
      .subscribe(data => {
        this.user = data;
      })

    this.webSocketService.setNameEvent("ABC123");
    this.webSocketService.callback.subscribe((message) => { // Quedarse escuchando los mensajes del backend
      console.log("Mensaje recibido en el navbar: ", message);
    });

  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }


    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
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
        this.securityService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  onImageError(event: any) {
  event.target.src = 'assets/img/theme/default-user.png';
}


}
