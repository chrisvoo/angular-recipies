import { createReducer, on } from '@ngrx/store';
import { ADD_INGREDIENT, ADD_INGREDIENTS, DELETE_INGREDIENT, START_EDIT_SHOP_LIST, STOP_EDIT_SHOP_LIST, UPDATE_INGREDIENT } from './shopping-list.actions';
import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListState } from 'src/app/store/app.state';

const initialState: ShoppingListState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],
  editedIngredient: undefined,
  editedIngredientIndex: -1
}

export const shoppingListReducer = createReducer(
  initialState,
  on(ADD_INGREDIENT, (state, { payload }): ShoppingListState => ({
    ...state, ingredients: [...state.ingredients, payload]
  })),
  on(ADD_INGREDIENTS, (state, { payload }): ShoppingListState => ({
    ...state, ingredients: [...state.ingredients, ...payload]
  })),
  on(UPDATE_INGREDIENT, (state, { payload: { newIngredient } }): ShoppingListState => {
    const ingredient = state.ingredients[state.editedIngredientIndex];
    const updateIngredient = {
      ...ingredient,
      ...newIngredient
    }
    const updatedIngredients = [...state.ingredients]
    updatedIngredients[state.editedIngredientIndex] = updateIngredient

    return {
      ...state,
      ingredients: updatedIngredients,
      editedIngredient: undefined,
      editedIngredientIndex: -1
    }
  }),
  on(DELETE_INGREDIENT, (state): ShoppingListState => ({
    ...state,
    ingredients: state.ingredients.filter((targetIngredient: Ingredient, theIndex: number) => theIndex !== state.editedIngredientIndex),
    editedIngredient: undefined,
    editedIngredientIndex: -1
  })),

  // editing
  on(START_EDIT_SHOP_LIST, (state, { payload }): ShoppingListState => ({
    ...state, editedIngredientIndex: payload,
    editedIngredient: { ...state.ingredients[payload] } // always return a new object!
  })),
  on(STOP_EDIT_SHOP_LIST, (state): ShoppingListState => ({
    ...state, editedIngredient: undefined, editedIngredientIndex: -1
  }))
)
