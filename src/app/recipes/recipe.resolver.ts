import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap, of } from 'rxjs';
import { AppState } from '../store/app.state';
import { Recipe } from './recipe.model';
import { FETCH_RECIPES, SET_RECIPES } from './store/recipes.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolver implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private $actions: Actions) {}

  /* no need to subscribe, resolve will do for us */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> {
    const recipeId = +route.params['id']

    return this.store.select('recipes').pipe(
      map(recipesState => recipesState.recipes),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(FETCH_RECIPES());
        }

        return of(recipes)
      })
    )
  }
}
