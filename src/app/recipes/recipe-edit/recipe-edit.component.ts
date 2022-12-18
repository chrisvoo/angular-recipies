import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number = -1;
  editMode: boolean = false;
  recipeForm!: UntypedFormGroup

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

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
      const recipe: Recipe|undefined = this.recipeService.getRecipeById(this.id);
      if (recipe) {
        recipeName = recipe.name!;
        description = recipe.description!;
        imagePath = recipe.imagePath!;
        ingredients = recipe.ingredients!;
      }
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
      const newRecipe = new Recipe()
      // lines below could be replaced with this.recipeService.updateRecipe(this.recipeForm.value),
      // however Recipe model shows how to use constructor overloading
      newRecipe.description = this.recipeForm.value['description'];
      newRecipe.name = this.recipeForm.value['name'];
      newRecipe.imagePath = this.recipeForm.value['imagePath'];
      newRecipe.ingredients = this.recipeForm.value['ingredients'];
      newRecipe.id = this.id;
      this.recipeService.updateRecipe(this.id, newRecipe)
    } else {
      this.recipeService.addRecipe(this.recipeForm.value)
    }
  }
}
