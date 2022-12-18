import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth.service';
import User from '../user.model';
import { LOGIN, LOGIN_FAILED, LOGIN_START } from './auth.actions';

@Injectable()
export class AuthEffects {
  private API_KEY = environment.FIREBASE_API_KEY;
  private SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`;
  private LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`;

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
            map((resData: AuthResponseData) => {
              const expirationDate = new Date(Date.now() + (+resData.expiresIn * 1000));
              const userModel = new User(
                resData.email, resData.localId, resData.idToken, expirationDate
              );

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

  authSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(LOGIN),
      tap(() => {
        this.router.navigate(['/']);
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}


