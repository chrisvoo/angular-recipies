import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import User from './user.model';
import { Router } from '@angular/router';
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
  private API_KEY = environment.FIREBASE_API_KEY;
  private SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;

  // public user = new BehaviorSubject<User|null>(null);

  private tokenExpirationTimer: ReturnType<typeof setTimeout>|null = null

  constructor(private http: HttpClient, private router: Router, private store: Store<AppState>) { }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this._handleAuthentication(
       this.http.post<AuthResponseData>(
        this.SIGNUP_URL,
        {
          email, password, returnSecureToken: true,
        }
      )
    )
  }

  autoLogout(expirationTime: number): void {
    this.tokenExpirationTimer = setTimeout((): void => {
      this.logout()
    }, (expirationTime * 1000))
  }

  autoLogin(): void {
    const userString = localStorage.getItem('userData');
    if (userString !== null) {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(userString)

      const { email, id, _token, _tokenExpirationDate } = userData

      const expDate = new Date(_tokenExpirationDate);
      const user = new User(email, id, _token, expDate);
      if (user.token) {
        this.store.dispatch(LOGIN({ payload: user }))
        this.autoLogout(expDate.getTime() - Date.now() / 1000)
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this._handleAuthentication(
        this.http.post<AuthResponseData>(
          this.LOGIN_URL,
          {
            email, password, returnSecureToken: true,
          }
        )
    )
  }

  logout(): void {
    this.store.dispatch(LOGOUT())
    // this.user.next(null);
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData')
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
      this.tokenExpirationTimer = null
    }
  }

  private _handleAuthentication(authObs: Observable<AuthResponseData> ): Observable<AuthResponseData> {
    return authObs.pipe(
      catchError(e => {
        const { code, message } = e.error.error
        let finalError = '';
        switch (message) {
          case 'EMAIL_NOT_FOUND':
          case 'INVALID_PASSWORD':
            finalError = 'Sorry, the credentials are not valid'
            break;
          default:
            finalError = 'Unknown error!'
            console.log(`Http status ${code}: ${message}`)
        }
        return throwError((): Error => new Error(finalError))
      }),
      tap(resData => {
        const expirationDate = new Date(Date.now() + (+resData.expiresIn * 1000));
        const userModel = new User(
          resData.email, resData.localId, resData.idToken, expirationDate
        );
        // this.user.next(userModel)
        this.store.dispatch(LOGIN({ payload: userModel }))
        this.autoLogout(+resData.expiresIn)
        localStorage.setItem('userData', JSON.stringify(userModel))
      })
    )
  }
}
