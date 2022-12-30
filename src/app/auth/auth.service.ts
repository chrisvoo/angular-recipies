import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { LOGIN, LOGOUT } from './store/auth.actions';


export interface AuthResponseData {
  idToken: string, //	A Firebase Auth ID token for the newly created user.
  email: string, //	The email for the newly created user.
  refreshToken:	string,	// A Firebase Auth refresh token for the newly created user.
  expiresIn: string, //	The number of seconds in which the ID token expires.
  localId: string, // The uid of the newly created user.
  registered?: boolean // Whether the email is for an existing account.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: ReturnType<typeof setTimeout>|null = null

  constructor(private store: Store<AppState>) { }

  // signup(email: string, password: string): Observable<AuthResponseData> {
  //   return this._handleAuthentication(
  //      this.http.post<AuthResponseData>(
  //       this.SIGNUP_URL,
  //       {
  //         email, password, returnSecureToken: true,
  //       }
  //     )
  //   )
  // }

  setLogoutTimer(expirationTime: number): void {
    this.tokenExpirationTimer = setTimeout((): void => {
      this.store.dispatch(LOGOUT())
    }, (expirationTime * 1000))
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
  }
}
