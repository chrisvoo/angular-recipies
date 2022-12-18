import { createAction, props } from '@ngrx/store';
import User from '../user.model';

export const LOGIN = createAction('[Auth] LOGIN', props<{ payload: User }>());
export const LOGOUT = createAction('[Auth] LOGOUT');
export const LOGIN_START = createAction('[Auth] LOGIN Start', props<{ payload: { email: string, password: string } }>());
export const LOGIN_FAILED = createAction('[Auth] LOGIN Failed', props<{ payload: string }>());

