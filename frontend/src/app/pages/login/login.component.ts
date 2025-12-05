import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User;
  isLoading = false;

  constructor(
    private securityService: SecurityService,
    private firebaseAuthService: FirebaseAuthService,
    private router: Router
  ) {
    this.user = { email: "", password: "" };
  }

  // Login con email y contraseña
  login() {
    if (!this.user.email || !this.user.password) {
      Swal.fire("Error", "Por favor completa todos los campos", "warning");
      return;
    }

    this.isLoading = true;
    console.log("componente " + JSON.stringify(this.user));

    this.securityService.login(this.user).subscribe({
      next: (data) => {
        console.log("data " + JSON.stringify(data));
        this.securityService.saveSession(data);
        this.isLoading = false;
        this.router.navigate(["dashboard"]);
      },
      error: (error) => {
        console.error("error " + JSON.stringify(error));
        this.isLoading = false;
        Swal.fire("Autenticación Inválida", "Usuario o contraseña inválido", "error");
      }
    });
  }

  // Login con Google
  loginWithGoogle() {
    this.isLoading = true;

    this.firebaseAuthService.loginWithGoogle().subscribe({
      next: (userData) => {
        console.log('Usuario de Google completo:', userData);

        this.securityService.saveSession({
          token: userData.uid,
          user: userData,
          name: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL
        });

        this.isLoading = false;
        Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola ${userData.displayName}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        this.router.navigate(["dashboard"]);
      },
      error: (error) => {
        console.error('Error en Google Sign-In:', error);
        this.isLoading = false;
        this.handleAuthError(error);
      }
    });
  }
  // Login con GitHub
  loginWithGithub() {
    this.isLoading = true;

    this.firebaseAuthService.loginWithGithub().subscribe({
      next: (userData) => {
        console.log('Usuario de GitHub:', userData);

        this.securityService.saveSession({
          token: userData.uid,
          user: userData,
          name: userData.login,
          email: userData.email,
          photoURL: userData.photoURL
        });

        this.isLoading = false;
        Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola ${userData.login}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        this.router.navigate(["dashboard"]);
      },
      error: (error) => {
        console.error('Error en GitHub Sign-In:', error);
        this.isLoading = false;
        this.handleAuthError(error);
      }
    });
  }

  // Login con Microsoft
  loginWithMicrosoft() {
    this.isLoading = true;

    this.firebaseAuthService.loginWithMicrosoft().subscribe({
      next: (userData) => {
        console.log('Usuario de Microsoft:', userData);

        this.securityService.saveSession({
          token: userData.uid,
          user: userData,
          name: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL
        });

        this.isLoading = false;
        Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola ${userData.displayName}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        this.router.navigate(["dashboard"]);
      },
      error: (error) => {
        console.error('Error en Microsoft Sign-In:', error);
        this.isLoading = false;
        this.handleAuthError(error);
      }
    });
  }

  // Manejador centralizado de errores
  handleAuthError(error: any) {
    let errorMessage = 'Error al iniciar sesión';
    let errorTitle = 'Error';

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Ventana cerrada antes de completar el inicio de sesión';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Solicitud cancelada';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorTitle = 'Cuenta ya existe';
      errorMessage = 'Ya tienes una cuenta con este correo usando otro proveedor (Google, GitHub o Microsoft). Por favor, inicia sesión con el método que usaste originalmente.';
      
      // Mensaje más detallado
      Swal.fire({
        title: errorTitle,
        html: `
          <p>${errorMessage}</p>
          <br>
          <p class="text-muted"><small>Si no recuerdas cuál método usaste, intenta con cada uno.</small></p>
        `,
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
      return;
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'Este dominio no está autorizado. Contacta al administrador.';
    }

    Swal.fire(errorTitle, errorMessage, "error");
  }

  ngOnInit() {
    this.firebaseAuthService.onAuthStateChanged((user) => {
      if (user) {
        console.log('Usuario ya autenticado:', user);
      }
    });
  }

  ngOnDestroy() {
  }
}