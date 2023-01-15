import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../auth/store/auth.reducer';
import { recipeReducer } from '../recipes/store/recipes.reducers'
import { shoppingListReducer } from '../shopping-list/store/shopping-list.reducer';


export const reducers: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: authReducer,
  recipes: recipeReducer,
};
