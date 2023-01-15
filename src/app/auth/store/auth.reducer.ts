import { createReducer, on } from '@ngrx/store';
import { CLEAR_ERROR, LOGIN, LOGIN_FAILED, LOGIN_START, LOGOUT } from './auth.actions';
import { AuthState } from 'src/app/store/app.state';
import User from '../user.model';

const initialState: AuthState = {
  user: undefined,
  authError: undefined,
  loading: false
}

export const authReducer = createReducer(
  initialState,
  on(LOGIN, ((state, { payload: { email, id, token, tokenExpirationDate, redirect } }): AuthState => ({
    ...state, authError: undefined, loading: false, user: new User(email, id, token!, tokenExpirationDate!, redirect)
  }))),
  on(LOGOUT, ((state): AuthState => ({
    ...state, user: undefined
  }))),
  on(LOGIN_START, ((state): AuthState => ({
    ...state, authError: undefined, loading: true,
  }))),
  on(LOGIN_FAILED, ((state, { payload }): AuthState => ({
    ...state, authError: payload, loading: false, user: undefined
  }))),
  on(CLEAR_ERROR, ((state): AuthState => ({
    ...state, authError: undefined
  })))
)
