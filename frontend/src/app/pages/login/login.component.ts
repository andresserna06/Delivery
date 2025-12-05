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
        console.log('Usuario de Google:', userData);

        this.securityService.saveSession({
          token: userData.uid,
          user: userData,
          name: userData.displayName
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

        let errorMessage = 'Error al iniciar sesión con Google';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Ventana cerrada antes de completar el inicio de sesión';
        } else if (error.code === 'auth/cancelled-popup-request') {
          errorMessage = 'Solicitud cancelada';
        }

        Swal.fire("Error", errorMessage, "error");
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
          name: userData.login
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
        Swal.fire("Error", "Error al iniciar sesión con GitHub", "error");
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
          name: userData.displayName
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

        let errorMessage = 'Error al iniciar sesión con Microsoft';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Ventana cerrada antes de completar el inicio de sesión';
        } else if (error.code === 'auth/cancelled-popup-request') {
          errorMessage = 'Solicitud cancelada';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
          errorMessage = 'Ya existe una cuenta con este email usando otro proveedor';
        }

        Swal.fire("Error", errorMessage, "error");
      }
    });
  }

  ngOnInit() {
    this.firebaseAuthService.onAuthStateChanged((user) => {
      if (user) {
        console.log('Usuario ya autenticado:', user);
        // Opcional: redirigir automáticamente
        // this.router.navigate(["dashboard"]);
      }
    });
  }

  ngOnDestroy() {
  }
}