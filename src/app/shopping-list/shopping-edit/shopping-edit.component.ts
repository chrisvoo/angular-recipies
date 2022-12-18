import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, ShoppingListState } from 'src/app/store/app.state';
import { Ingredient } from 'src/app/shared/ingredient.model';
// import { ShoppingListService } from '../shopping-list.service';
import { ADD_INGREDIENT, DELETE_INGREDIENT, STOP_EDIT_SHOP_LIST, UPDATE_INGREDIENT } from '../store/shopping-list.actions';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) form!: NgForm
  editedIngredient?: Ingredient;
  editMode = false;
  editIngredientSub?: Subscription;

  constructor(
    // private shoppingListService: ShoppingListService,
    private store: Store<AppState>
  ) { }


  ngOnInit(): void {
    this.editIngredientSub = this.store.select('shoppingList').subscribe((stateData: ShoppingListState) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedIngredient = stateData.editedIngredient;
        this.form.setValue({
          name: this.editedIngredient?.name,
          amount: this.editedIngredient?.amount
        })
      } else {
        this.editMode = false;
      }

    })
    // this.editIngredientSub = this.shoppingListService.startedEditing.subscribe((index) => {
    //   this.editMode = true;
    //   this.editedItemIndex = index;
    //   this.editedIngredient = this.shoppingListService.getIngredient(index);
    //   this.form.setValue({
    //     name: this.editedIngredient.name,
    //     amount: this.editedIngredient.amount
    //   })
    // })
  }

  ngOnDestroy(): void {
      this.editIngredientSub?.unsubscribe();
      this.onClear();
  }

  onClear() {
    this.form.reset();
    this.store.dispatch(STOP_EDIT_SHOP_LIST())
    // this.editMode = false;
  }

  onDelete() {
    this.store.dispatch(DELETE_INGREDIENT())
    // this.shoppingListService.deleteIngredient(this.editedItemIndex!);
    this.onClear();
  }

  onSubmit(form: NgForm) {
    const newIngredient = new Ingredient(
      form.value.name,
      parseInt(form.value.amount)
    )

    if (this.editMode) {
      this.store.dispatch(UPDATE_INGREDIENT({ payload: { newIngredient }}))
      // this.shoppingListService.updateIngredient(newIngredient, this.editedItemIndex!)
    } else {
      // this.shoppingListService.addIngredient(newIngredient)
      this.store.dispatch(ADD_INGREDIENT({ payload: newIngredient }))
    }

    this.onClear()
  }

}
