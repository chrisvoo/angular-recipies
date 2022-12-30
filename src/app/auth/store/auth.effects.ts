import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponseData, AuthService } from '../auth.service';
import User from '../user.model';
import { AUTO_LOGIN, LOGIN, LOGIN_FAILED, LOGIN_START, LOGOUT } from './auth.actions';

@Injectable()
export class AuthEffects {
  private API_KEY = environment.FIREBASE_API_KEY;
  private SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  doLogin$ = createEffect(() =>
    this.actions$.pipe(
        ofType(LOGIN_START),
        // https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap
        // switch to a new observable
        switchMap((action) => {
          const { email, password } = action.payload

          return this.http.post<AuthResponseData>(
            this.LOGIN_URL,
            {
              email, password, returnSecureToken: true,
            }
          ).pipe(
            tap((resData: AuthResponseData) => {
              this.authService.setLogoutTimer(+resData.expiresIn)
            }),
            map((resData: AuthResponseData) => {
              const expirationDate = new Date(Date.now() + (+resData.expiresIn * 1000));
              const userModel = new User(
                resData.email, resData.localId, resData.idToken, expirationDate
              );
              localStorage.setItem('userData', JSON.stringify(userModel))

              return LOGIN({ payload: userModel })
            }),
            catchError((errorRes) => {
              let errorMessage = 'An unknown error occurred!';
              if (!errorRes.error || !errorRes.error.error) {
                return of(LOGIN_FAILED({ payload: errorMessage }));
              }
              switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                  errorMessage = 'This email exists already';
                  break;
                case 'EMAIL_NOT_FOUND':
                  errorMessage = 'This email does not exist.';
                  break;
                case 'INVALID_PASSWORD':
                  errorMessage = 'This password is not correct.';
                  break;
              }
              return of(LOGIN_FAILED({ payload: errorMessage }));
            })
          )
        })
    )
  );

  authSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN),
      tap(() => {
        this.router.navigate(['/']);
      })
    ), { dispatch: false } // without this, it creates a nasty loop
  );

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(LOGOUT),
        tap(() => {
          this.router.navigate(['/auth'])
          localStorage.removeItem('userData')
          this.authService.clearLogoutTimer()
        })
      ), { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AUTO_LOGIN),
        map(() => {
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
              const expDuration = new Date(_tokenExpirationDate).getTime() - new Date().getTime()
              this.authService.setLogoutTimer(expDuration)
              return LOGIN({ payload: user })
            }
          }

          return { type: ''};
        })
      )
  );
}


