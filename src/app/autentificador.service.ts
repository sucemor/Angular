import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutentificadorService {
  // Simulando la carga de datos de usuarios desde un archivo JSON
  private users = [
    { username: 'user1', password: 'pass1' },
    { username: 'user2', password: 'pass2' }
  ];

  authenticate(username: string, password: string): Observable<boolean> {
    return of(this.users).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Error during authentication', error);
        return throwError('Authentication failed');
      })
    );
  }

  isLoggedIn(): boolean {
    const loggedIn = localStorage.getItem('isLoggedIn');
    return loggedIn === 'true';
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  }
}
