import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ADD_INGREDIENTS } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.state';
import { Recipe } from '../recipe.model';
import { DELETE_RECIPE } from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public recipe: Recipe | undefined;
  private recipeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.recipeId = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe) => {
            return recipe.id === this.recipeId;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  toShoppingList(ingredients: Ingredient[] | undefined) {
      if (ingredients) {
        this.store.dispatch(ADD_INGREDIENTS({ payload: ingredients }))
      }
  }

  onRecipeEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onRecipeDelete() {
    this.store.dispatch(DELETE_RECIPE({ payload: { recipeId: this.recipeId }}))
    this.router.navigate(['/recipe-list'])
  }
}
