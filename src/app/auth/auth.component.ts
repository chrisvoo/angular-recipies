import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../store/app.state';
import { AuthResponseData } from './auth.service';
import { CLEAR_ERROR, LOGIN_START } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  inLoginMode = true;
  isLoading = false;
  error?: string|undefined = undefined;
  private closeSub?: Subscription;
  private storeSub?: Subscription;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }

  onSwitchMode() {
    this.inLoginMode = !this.inLoginMode;
  }

  onHandleError() {
    this.store.dispatch(CLEAR_ERROR());
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = form.value

    let authObs: Observable<AuthResponseData>;

    if (this.inLoginMode) {
      this.store.dispatch(
        LOGIN_START({ payload: { email, password } })
      );
    } else {
      //authObs = this.authService.signup(email, password);
    }

    form.reset()
  }
}
