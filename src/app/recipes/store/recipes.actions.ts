import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const SET_RECIPES = createAction('[Recipes] Set Recipes', props<{ payload: Recipe[] }>());
export const FETCH_RECIPES = createAction('[Recipes] Fetch Recipes');
export const STORE_RECIPIES = createAction('[Recipes] Store recipes');
export const ADD_RECIPE = createAction('[Recipes] Add Recipe', props<{ payload: Recipe }>());
export const UPDATE_RECIPE = createAction('[Recipes] Update Recipe', props<{ payload: { newRecipe: Recipe }}>());
export const DELETE_RECIPE = createAction('[Recipes] Delete Recipe', props<{ payload: { recipeId: number }}>());
