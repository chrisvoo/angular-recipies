import { Injectable, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { AppState } from '../store/app.state';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { ADD_INGREDIENTS } from '../shopping-list/store/shopping-list.actions';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService implements OnInit {
  refreshRecipies: Subject<Recipe[]> = new Subject();

  private recipes: Recipe[] = []

  constructor(
    private shopListService: ShoppingListService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

  }

  addRecipe(recipe: Recipe) {
    let maxId = Math.max(...this.recipes.map(o => o.id))
    recipe.id = ++maxId; // autoincrement
    this.recipes.push(recipe);

    this.refreshRecipies.next(this.recipes.slice());
  }

  deleteRecipe(recipeId: number) {
    const index = this.getRecipeIndexById(recipeId);
    this.recipes.splice(index, 1);

    this.refreshRecipies.next(this.recipes.slice());
  }

  private getRecipeIndexById(recipeId: number): number {
    for (let i = 0; i < this.recipes.length; i++) {
      if (this.recipes[i].id === recipeId) {
        return i;
      }
    }

    throw new Error(`Cannot find recipe ${recipeId}`);
  }

  updateRecipe(recipeId: number, newRecipe: Recipe) {
    this.recipes[this.getRecipeIndexById(recipeId)] = newRecipe;
    this.refreshRecipies.next(this.recipes.slice());
  }

  getRecipeById(recipeId: number | string): Recipe | undefined {
    return this.recipes.find((value: Recipe) => value.id === +recipeId);
  }

  getRecipies() {
    // new array, we don't want to return an accessible reference
    return this.recipes.slice()
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.shopListService.addIngredients(ingredients)
    this.store.dispatch(ADD_INGREDIENTS({ payload: ingredients }))
  }

  setRecipies(recipies: Recipe[]) {
    this.recipes = recipies;
    this.refreshRecipies.next(this.recipes.slice());
  }
}
