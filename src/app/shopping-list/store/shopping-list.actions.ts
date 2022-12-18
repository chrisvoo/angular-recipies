import { createAction, props } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export const ADD_INGREDIENT = createAction('[Shopping List] ADD_INGREDIENT', props<{ payload: Ingredient }>());
export const ADD_INGREDIENTS = createAction('[Shopping List] ADD_INGREDIENTS', props<{ payload: Ingredient[] }>());
export const UPDATE_INGREDIENT = createAction('[Shopping List] UPDATE_INGREDIENT', props<{ payload: { newIngredient: Ingredient }}>());
export const DELETE_INGREDIENT = createAction('[Shopping List] DELETE_INGREDIENT');

// number of the ingredient I want to edit
export const START_EDIT_SHOP_LIST = createAction('[Shopping List] START_EDIT_SHOP_LIST', props<{ payload: number }>());
export const STOP_EDIT_SHOP_LIST = createAction('[Shopping List] STOP_EDIT_SHOP_LIST');
