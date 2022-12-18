import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, map, Observable, take } from 'rxjs';
import { AppState, AuthState } from '../store/app.state';
import { AuthService } from './auth.service';
import User from './user.model.js';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private store: Store<AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map((auth: AuthState) => auth.user),
      exhaustMap((user: User | undefined) => {
        // if there's no user, return the original request. We could also check the URL and attach the token
        // only for a particular list of URLs
        if (!user) {
          return next.handle(req)
        }

        const reqCloned = req.clone({ params: new HttpParams().set('auth', user?.token ?? '')})
        return next.handle(reqCloned)
      })
    )
  }
}
