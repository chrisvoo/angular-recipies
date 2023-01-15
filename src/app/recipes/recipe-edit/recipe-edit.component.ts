import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { AppState } from 'src/app/store/app.state';
import { ADD_RECIPE, UPDATE_RECIPE } from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number = -1;
  editMode: boolean = false;
  recipeForm!: UntypedFormGroup

  private storedSub?: Subscription = undefined

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnDestroy(): void {
    if (this.storedSub) {
      this.storedSub.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] !== undefined;
      this.initForm();
    })
  }

  private initForm() {
    let recipeName = '';
    let description = '';
    let imagePath = '';
    let ingredients: Ingredient[] = [];

    if (this.editMode) {
      // const recipe: Recipe|undefined = this.recipeService.getRecipeById(this.id);
      this.storedSub = this.store.select('recipes').pipe(
        map(recipeState => recipeState.recipes.find((r) => r.id === this.id))
      ).subscribe(recipe => {
        if (recipe) {
          recipeName = recipe.name!;
          description = recipe.description!;
          imagePath = recipe.imagePath!;
          ingredients = recipe.ingredients!;
        }

        const recipeIngredients = new UntypedFormArray([]);

        if (ingredients.length) {
          for(let ingredient of ingredients) {
            recipeIngredients.push(new UntypedFormGroup({
              name: new UntypedFormControl(ingredient.name, Validators.required),
              amount: new UntypedFormControl(ingredient.amount, [Validators.pattern(/^[1-9]+[0-9]*/), Validators.required])
            }))
          }
        }

        this.recipeForm = new UntypedFormGroup({
          name: new UntypedFormControl(recipeName, Validators.required),
          description: new UntypedFormControl(description, Validators.required),
          imagePath: new UntypedFormControl(imagePath, Validators.required),
          ingredients: recipeIngredients,
        })
      })
    }
  }

  onAddIngredient() {
    (<UntypedFormArray>this.recipeForm.get('ingredients')).push(new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      amount: new UntypedFormControl(null, [Validators.pattern(/^[1-9]+[0-9]*/), Validators.required])
    }))
  }

  onDeleteIngredient(i: number) {
    return (<UntypedFormArray>this.recipeForm.get('ingredients')).removeAt(i)
  }

  get controls() { // a getter!
    return (<UntypedFormArray>this.recipeForm.get('ingredients')).controls;
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onSubmit() {
    if (this.editMode) {
      const newRecipe = this.recipeForm.value
      newRecipe.id = this.id
      this.store.dispatch(UPDATE_RECIPE({ payload: { newRecipe }}))
    } else {
      this.store.dispatch(ADD_RECIPE({ payload: this.recipeForm.value }))
    }
  }
}
