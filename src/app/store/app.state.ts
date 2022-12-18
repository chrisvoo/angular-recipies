import User from "../auth/user.model.js";
import { Ingredient } from "../shared/ingredient.model";

export interface ShoppingListState {
  ingredients: Ingredient[],
  editedIngredient?: Ingredient,
  editedIngredientIndex: number
}

export interface AuthState {
  user?: User,
  authError?: string,
  loading: boolean
}

export interface AppState {
  shoppingList: ShoppingListState,
  auth: AuthState
}
