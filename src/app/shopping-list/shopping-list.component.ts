import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState, ShoppingListState } from '../store/app.state.js';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import { START_EDIT_SHOP_LIST } from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Observable<ShoppingListState>;
  private subscription?: Subscription;

  constructor(
    // private shppingListService: ShoppingListService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')

    // this.ingredients = this.shppingListService.getIngredients()
    // necessary to catch the updates, otherwise the list would stay the same even though
    // we add new ingredients.
    // this.subscription = this.shppingListService.ingredientsChanged.subscribe(
    //   (ingredients) => this.ingredients = ingredients
    // )
  }

  ngOnDestroy(): void {
      // this.subscription?.unsubscribe();
  }

  onEditItem(index: number) {
    this.store.dispatch(START_EDIT_SHOP_LIST({ payload: index }))
    // this.shppingListService.startedEditing.next(index);
  }
}
