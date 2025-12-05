import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  theUser = new BehaviorSubject<User>(new User);
  constructor(private http: HttpClient) {
    this.verifyActualSession()
  }

  /**
  * Realiza la petición al backend con el correo y la contraseña
  * para verificar si existe o no en la plataforma
  * @param infoUsuario JSON con la información de correo y contraseña
  * @returns Respuesta HTTP la cual indica si el usuario tiene permiso de acceso
  */
  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_security}/login`, user);
  }

  /*
  Guardar la información de usuario en el local storage
  */
  saveSession(dataSesion: any) {
    console.log('=== DATOS RECIBIDOS ===', dataSesion);

    // Extraer la foto de diferentes posibles ubicaciones
    let photoUrl = null;

    if (dataSesion["photo"]) {
      photoUrl = dataSesion["photo"];
    } else if (dataSesion["photoURL"]) {
      photoUrl = dataSesion["photoURL"];
    } else if (dataSesion.user && dataSesion.user.photoURL) {
      photoUrl = dataSesion.user.photoURL;
    }

    console.log('=== PHOTO URL ENCONTRADA ===', photoUrl);

    let data: User = {
      id: dataSesion["id"] || dataSesion.user?.uid,
      name: dataSesion["name"] || dataSesion.user?.displayName,
      email: dataSesion["email"] || dataSesion.user?.email,
      password: "",
      token: dataSesion["token"] || dataSesion.user?.uid,
      photo: photoUrl
    };

    console.log('=== DATOS A GUARDAR ===', data);

    localStorage.setItem('sesion', JSON.stringify(data));
    this.setUser(data);

    // Verificación
    const saved = localStorage.getItem('sesion');
    console.log('=== GUARDADO EN LOCALSTORAGE ===', JSON.parse(saved));
  }

  /**
   * Obtiene la sesión completa como objeto
   * @returns Objeto con los datos de la sesión o null si no existe
   */
  getSession(): any {
    const sessionData = this.getSessionData();
    return sessionData ? JSON.parse(sessionData) : null;
  }

  /**
    * Permite actualizar la información del usuario
    * que acabó de validarse correctamente
    * @param user información del usuario logueado
  */
  setUser(user: User) {
    this.theUser.next(user);
  }

  /**
  * Permite obtener la información del usuario
  * con datos tales como el identificador y el token
  * @returns
  */
  getUser() {
    return this.theUser.asObservable(); // .asObservable() para notificar a todo el mundo que hubo un cambio 
  }

  /**
    * Permite obtener la información de usuario
    * que tiene la función activa y servirá
    * para acceder a la información del token
  */
  public get activeUserSession(): User {
    return this.theUser.value;
  }

  /**
  * Permite cerrar la sesión del usuario
  * que estaba previamente logueado
  */
  logout() {
    localStorage.removeItem('sesion');
    this.setUser(new User());
  }

  /**
  * Permite verificar si actualmente en el local storage
  * existe información de un usuario previamente logueado
  */
  verifyActualSession() {
    let actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }

  /**
  * Verifica si hay una sesion activa
  * @returns
  */
  existSession(): boolean {
    let sesionActual = this.getSessionData();
    return (sesionActual) ? true : false;
  }

  /**
  * Permite obtener los dato de la sesión activa en el
  * local storage
  * @returns
  */
  getSessionData() {
    let sesionActual = localStorage.getItem('sesion');
    return sesionActual;
  }
}