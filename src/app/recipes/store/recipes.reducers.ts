import { createReducer, on } from '@ngrx/store';
import { RecipeState } from 'src/app/store/app.state';
import { ADD_RECIPE, DELETE_RECIPE, SET_RECIPES, UPDATE_RECIPE } from './recipes.actions';

const initialState: RecipeState = {
  recipes: []
}

export const recipeReducer = createReducer(
  initialState,
  on(SET_RECIPES, ((state, { payload }): RecipeState => ({
    ...state, recipes: [...payload]
  }))),
  on(ADD_RECIPE, ((state, { payload }): RecipeState => {
    const recipe = payload

    const maxId = state.recipes.reduce((acc, recipe) => acc < recipe.id ? acc : recipe.id, 0)
    recipe.id = maxId + 1

    return {
      ...state,
      recipes: [...state.recipes, recipe] }
  })),
  on(UPDATE_RECIPE, ((state, { payload }): RecipeState => {
    const updatedRecipe = {
      ...state.recipes.filter(r => r.id === payload.newRecipe.id),
      ...payload.newRecipe // overwrites the properties
    }

    const updatedRecipies = [...state.recipes]
    updatedRecipies[state.recipes.findIndex((r) => r.id === payload.newRecipe.id)] = updatedRecipe
    return { ...state, recipes: updatedRecipies }
  })),
  on(DELETE_RECIPE, ((state, { payload }): RecipeState => {
    return { ...state, recipes: [...state.recipes.filter((r) => r.id !== payload.recipeId)] }
  }))
);
