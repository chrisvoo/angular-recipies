import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, switchMap, tap, take, withLatestFrom } from 'rxjs/operators';
import { FETCH_RECIPES, SET_RECIPES, STORE_RECIPIES } from './recipes.actions';
import { Recipe } from '../recipe.model';
import { AppState, AuthState } from 'src/app/store/app.state';

@Injectable()
export class RecipeEffects {
  private FIREBASE_URL = 'https://ng-course-recipe-book-f0392-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}

  fetchRecipies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FETCH_RECIPES),
      switchMap(() => this.store.select('auth').pipe(
        take<AuthState>(1),
        map((authState: AuthState) => authState.user!),
      )),
      exhaustMap((user) => {
        return this.http
          .get<Recipe[]>(
            `${this.FIREBASE_URL}/recipes.json`,
            { params: new HttpParams().set('auth', user.token ?? '')}
          )
      }),
      map((recipies: Recipe[]) => {
        return recipies.map((recipe: Recipe) => {
          return {...recipe, ingredients: recipe.ingredients ?? []}
        })
      }),
      map(recipies => SET_RECIPES({ payload: recipies }))
    )
  )

  storeRecipies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(STORE_RECIPIES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipeState]) => {
        return this.http.put(
          `${this.FIREBASE_URL}/recipes.json`,
          recipeState.recipes,
        );
      })
    ), { dispatch: false }
  )
}
