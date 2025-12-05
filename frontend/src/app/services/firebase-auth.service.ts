import { Injectable } from '@angular/core';
import { auth, googleProvider, githubProvider, microsoftProvider } from 'src/Auth/fireBaseConfig';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor() { }

  // Autenticación con Google
  loginWithGoogle(): Observable<any> {
    return from(signInWithPopup(auth, googleProvider)).pipe(
      map((result) => {
        const user = result.user;
        const credential = result.providerId;

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          credential: credential
        };
      }),
      catchError((error) => {
        console.error('Error en Google Sign-In:', error);
        throw error;
      })
    );
  }

  // Autenticación con GitHub
  loginWithGithub(): Observable<any> {
    return from(signInWithPopup(auth, githubProvider)).pipe(
      map((result) => {
        const user = result.user;

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          login: user.displayName || user.email
        };
      }),
      catchError((error) => {
        console.error('Error en GitHub Sign-In:', error);
        throw error;
      })
    );
  }

  // Autenticación con Microsoft
  loginWithMicrosoft(): Observable<any> {
    return from(signInWithPopup(auth, microsoftProvider)).pipe(
      map((result) => {
        const user = result.user;

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        };
      }),
      catchError((error) => {
        console.error('Error en Microsoft Sign-In:', error);
        throw error;
      })
    );
  }

  // Cerrar sesión
  logout(): Observable<void> {
    return from(signOut(auth));
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Observar cambios en el estado de autenticación
  onAuthStateChanged(callback: (user: User | null) => void): void {
    auth.onAuthStateChanged(callback);
  }
}