import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate { // Can acti

  constructor(private securityService: SecurityService,
              private router: Router //El roouter para saber que ruta se esta intentando acceder
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree { 
    if (this.securityService.existSession()) { // Veritica si existe una sesión activa y muestra la pagina 
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }

}
