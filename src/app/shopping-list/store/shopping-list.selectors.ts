import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { Ingredient } from "src/app/shared/ingredient.model.js";

export const getIngredient = (index: number) =>
    createSelector(
      (state: AppState): Ingredient[] => state.shoppingList.ingredients,
      (ing: Ingredient[]): Ingredient => ing[index]
    );
