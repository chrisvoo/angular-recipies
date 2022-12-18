import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import User from '../auth/user.model.js';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AppState, AuthState } from '../store/app.state';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private FIREBASE_URL = 'https://ng-course-recipe-book-f0392-default-rtdb.europe-west1.firebasedatabase.app';
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<AppState>
  ) { }


  storeRecipes() {
    const recipes = this.recipeService.getRecipies()
    this.http.put(
      `${this.FIREBASE_URL}/recipes.json`,
      recipes,
    ).subscribe(response => console.log(response))
  }

  fetchRecipies() {
    return this.store.select('auth').pipe(
      take<AuthState>(1), // emits just one value from the observable
      map((authState: AuthState) => authState.user!),
      exhaustMap((user: User) => { // https://blog.angular-university.io/rxjs-higher-order-mapping/
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
      tap(recipies => this.recipeService.setRecipies(recipies))
    )
  }
}
