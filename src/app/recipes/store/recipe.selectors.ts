import { createSelector } from '@ngrx/store';
import { AppState, RecipeState } from 'src/app/store/app.state';

export const selectRecipes = (state: AppState): RecipeState => state.recipes;

export const getRecipe = (recipeId: number) => createSelector(selectRecipes, ({ recipes }) => {
  return recipes.filter(r => r.id === recipeId);
});

