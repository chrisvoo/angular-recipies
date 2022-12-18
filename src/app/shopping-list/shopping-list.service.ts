import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { LoggingService } from '../shared/logging.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>(); // ingredient index

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  constructor(private logService: LoggingService) { }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(ingredient: Ingredient, index: number) {
    this.ingredients[index] = ingredient;
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.logService.log("Ingredient " + ingredient.name + " added")
    // necessary to inform shopping-list.component that the ingredients list has been updated.
    this.ingredientsChanged.next(this.getIngredients())
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (const ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.getIngredients());
  }
}
